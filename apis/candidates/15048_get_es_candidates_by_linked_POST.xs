query get_es_candidates_by_linked verb=POST {
  api_group = "candidates"

  input {
    object[] prospects? {
      schema {
        text prospect_es_id? filters=trim
        text linkedid_link? filters=trim
        text email? filters=trim
        text phone? filters=trim
      }
    }
  }

  stack {
    api.lambda {
      code = """
        /**
         * Xano Function - Build Elasticsearch query to map prospects (internal IDs) to ATS candidates
         *
         * INPUT ($input)
         * {
         *   prospects: [
         *     { prospect_es_id, linkedid_link, email, phone },
         *     ...
         *   ]
         * }
         *
         * OUTPUT (return): Elasticsearch POST body for `POST candidates/_search`
         * - one aggregation bucket per prospect
         * - simple match rules only (no scripts/regex):
         *   - LinkedIn: wildcard on slug (case_insensitive)
         *   - Email: exact term on `email.keyword` + soft wildcard on `email`
         *   - Phone: exact term on `phone_number.keyword` (byte-for-byte)
         * - each bucket uses `top_hits.size = 1` and echoes your internal ID via `script_fields`
         */
        
        // ---------- helpers ----------
        const S = (x) => (typeof x === 'string' ? x.trim() : '');
        
        const extractLinkedinSlug = (url) => {
          const u = S(url);
          if (!u) return '';
          let s = u.split('?')[0].replace(/\/$/, '');
          const i = s.toLowerCase().indexOf('/in/');
          s = i !== -1 ? s.slice(i + 4) : s.slice(s.lastIndexOf('/') + 1);
          return s.toLowerCase();
        };
        
        const linkedinClauses = (link) => {
          const slug = extractLinkedinSlug(link);
          return slug
            ? [{ wildcard: { linkedin_profile: { value: `*${slug}*`, case_insensitive: true } } }]
            : [];
        };
        
        const emailClauses = (email) => {
          const e = S(email).toLowerCase();
          return e
            ? [
                { term: { 'email.keyword': e } },
                { wildcard: { email: { value: `*${e}*`, case_insensitive: true } } },
              ]
            : [];
        };
        
        // Phone: exact match only (no normalization). Must match `phone_number.keyword` byte-for-byte.
        const phoneClauses = (phone) => {
          const p = S(phone);
          return p ? [ { term: { 'phone_number.keyword': p } } ] : [];
        };
        
        const bucketKey = (id, i) =>
          `prospect_${(S(id) || String(i + 1)).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
        
        const buildBucket = (p, i) => {
          const should = [
            ...linkedinClauses(p.linkedid_link),
            ...emailClauses(p.email),
            ...phoneClauses(p.phone),
          ];
        
          return {
            filter: should.length ? { bool: { should, minimum_should_match: 1 } } : { match_none: {} },
            aggs: {
              matches: {
                top_hits: {
                  _source: ['manatal_id', 'linkedin_profile', 'email', 'phone_number'],
                  size: 1,
                  script_fields: {
                    prospect_internal_id: {
                      script: { source: 'params.v', params: { v: S(p.prospect_es_id) || String(i + 1) } },
                    },
                  },
                },
              },
            },
          };
        };
        
        // ---------- main ----------
        if (!$input.prospects || !Array.isArray($input.prospects)) {
          // return empty ES body if input is missing or bad shape
          return { size: 0, track_total_hits: false, aggs: {} };
        }
        
        const prospects = $input.prospects;
        if (!prospects.length) {
          return { size: 0, track_total_hits: false, aggs: {} };
        }
        
        const aggs = {};
        prospects.forEach((p, i) => {
          const key = bucketKey(p.prospect_es_id, i);
          aggs[key] = buildBucket(p, i);
        });
        
        return {
          size: 0,
          track_total_hits: false,
          aggs,
        };
        """
      timeout = 10
    } as $x1
  
    cloud.elasticsearch.query {
      auth_type = "API Key"
      key_id = "mwmxdlijah"
      access_key = "pofdbdrvb3"
      region = ""
      index = "candidates"
      payload = `$x1`
      size = ""
      from = 0
      sort = []
      included_fields = []
      return_type = "search"
    } as $x2
  }

  response = $x2
}