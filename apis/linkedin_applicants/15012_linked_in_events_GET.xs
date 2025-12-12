query linked_in_events verb=GET {
  api_group = "linkedin_applicants"
  auth = "user"

  input {
    int timestamp?
  }

  stack {
    // 1. Determine start time (default to 24 hours ago)
    api.lambda {
      code = """
          const requested = Number($input.timestamp);
          const nowMs = Date.now();
          const resolved = (!Number.isNaN(requested) && requested > 0)
            ? requested
            : nowMs - 86400000;
          return { start_time_ms: resolved };
        """
      timeout = 5
    } as $start_time_calc
  
    var $start_time_ms {
      value = $start_time_calc.start_time_ms
    }
  
    var $start_timestamp {
      value = $start_time_ms|format_timestamp:"c":"UTC"
    }
  
    // 2. Fetch Connections
    db.query linkedin_connections {
      where = $db.linkedin_connections.created_at >= $start_timestamp
      return = {type: "list", paging: {page: 1, per_page: 50}}
      addon = [
        {
          name : "user"
          input: {user_id: $output.user_id}
          as   : "items._user"
        }
      ]
    } as $connections
  
    // 3. Fetch Invitations
    db.query linkedin_invitation {
      where = $db.linkedin_invitation.created_at >= $start_timestamp
      return = {type: "list", paging: {page: 1, per_page: 50}}
      addon = [
        {
          name : "user"
          input: {user_id: $output.user_id}
          as   : "items._user"
        }
      ]
    } as $invitations
  
    var $connection_items {
      value = $connections.items|safe_array
    }
  
    var $invitation_items {
      value = $invitations.items|safe_array
    }
  
    // 4. Normalize and Merge Events
    api.lambda {
      code = """
          const connections = Array.isArray($var.connection_items) ? $var.connection_items : [];
          const invitations = Array.isArray($var.invitation_items) ? $var.invitation_items : [];
          
          const normalizeDate = (dateVal) => {
             if (typeof dateVal === "number") return dateVal;
             const parsed = Date.parse(dateVal);
             return Number.isNaN(parsed) ? null : parsed;
          };
        
          const normalizeUrl = (url) => {
             if (!url) return null;
             if (url.includes('linkedin.com')) return url;
             return `https://www.linkedin.com/in/${url}`;
          };
        
          const connEvents = connections.map(item => ({
              ...item,
              Connection_Profile_URL: normalizeUrl(item.Connection_Profile_URL),
              event_type: 'connection',
              event_date: item.Connected_On,
              event_timestamp_ms: normalizeDate(item.Connected_On),
              created_at_ms: normalizeDate(item.created_at)
          }));
        
          const invEvents = invitations.map(item => ({
              ...item,
              Connection_Profile_URL: normalizeUrl(item.Connection_Profile_URL),
              event_type: 'invitation',
              event_date: item.Invited_On,
              event_timestamp_ms: normalizeDate(item.Invited_On),
              created_at_ms: normalizeDate(item.created_at)
          }));
          
          const events = [...connEvents, ...invEvents];
          
          // Extract unique URLs for lookup
          const urls = new Set();
          events.forEach(e => {
            if (e.Connection_Profile_URL) {
              urls.add(e.Connection_Profile_URL);
            }
          });
          
          return {
            events: events,
            urls: Array.from(urls)
          };
        """
      timeout = 10
    } as $merged_data
  
    var $urls {
      value = $merged_data.urls
    }
  
    // 5. Bulk Lookup Candidates
    var $candidates {
      value = []
    }
  
    conditional {
      if (($urls|count) > 0) {
        db.query parsed_candidate {
          where = $db.parsed_candidate.linkedin_profile in $urls
          return = {type: "list"}
          output = ["id", "linkedin_profile", "elastic_search_document_id"]
        } as $candidates
      }
    }
  
    // 6. Bulk Lookup Prospects
    var $prospects {
      value = []
    }
  
    conditional {
      if (($urls|count) > 0) {
        db.query parsed_prospect {
          where = $db.parsed_prospect.linkedin_profile in $urls
          return = {type: "list"}
          output = ["id", "linkedin_profile", "elastic_search_document_id"]
        } as $prospects
      }
    }
  
    var $events_var {
      value = $merged_data.events
    }
  
    var $candidates_var {
      value = $candidates
    }
  
    var $prospects_var {
      value = $prospects
    }
  
    // 7. Enrich and Sort Events
    api.lambda {
      code = """
          const events = $var.events_var || [];
          const candidates = Array.isArray($var.candidates_var) ? $var.candidates_var : [];
          const prospects = Array.isArray($var.prospects_var) ? $var.prospects_var : [];
          const startTime = typeof $var.start_time_ms === "number" ? $var.start_time_ms : 0;
          
          // Build Lookup Maps
          const candidateMap = {};
          candidates.forEach(c => {
            if (c.linkedin_profile) candidateMap[c.linkedin_profile] = { id: c.id, es_id: c.elastic_search_document_id };
          });
          
          const prospectMap = {};
          prospects.forEach(p => {
            if (p.linkedin_profile) prospectMap[p.linkedin_profile] = { id: p.id, es_id: p.elastic_search_document_id };
          });
          
          // Enrich
          const enriched = events.map(e => {
            const url = e.Connection_Profile_URL;
            let personId = null;
            let personType = null;
            let esId = null;
            
            if (url) {
              if (candidateMap[url]) {
                personId = candidateMap[url].id;
                esId = candidateMap[url].es_id;
                personType = 'candidate';
              } else if (prospectMap[url]) {
                personId = prospectMap[url].id;
                esId = prospectMap[url].es_id;
                personType = 'prospect';
              }
            }
            
            return {
              ...e,
              person_id: personId,
              person_type: personType,
              elastic_search_document_id: esId
            };
          });
        
          // Filter by timestamp (double check)
          const filtered = enriched.filter(event => {
              const createdAt = typeof event?.created_at_ms === "number" ? event.created_at_ms : null;
              if (typeof createdAt !== "number" || Number.isNaN(createdAt)) {
                return false;
              }
              return createdAt >= startTime;
          });
        
          // Sort by date descending
          return filtered.sort((a, b) => {
              const aTs = typeof a.event_timestamp_ms === "number" ? a.event_timestamp_ms : (a.created_at_ms || 0);
              const bTs = typeof b.event_timestamp_ms === "number" ? b.event_timestamp_ms : (b.created_at_ms || 0);
              return bTs - aTs;
          });
        """
      timeout = 10
    } as $final_events
  }

  response = $final_events
}