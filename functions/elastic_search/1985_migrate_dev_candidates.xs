function "elastic_search/migrate_dev_candidates" {
  input {
    int limit?=10
    bool push_to_elastic?
  }

  stack {
    // Branch guard - only runs on dev
    precondition (($env.$branch|json_encode)|to_lower|contains:"development") {
      error = "Only runs on development branch"
    }
  
    // Clamp limit to max 250
    var $limit {
      value = (($input.limit > 250) ? 250 : $input.limit)
    }
  
    // Fetch random candidates from database
    db.query parsed_candidate {
      sort = {parsed_candidate.id: "rand"}
      return = {type: "list", paging: {page: 1, per_page: $limit}}
    } as $records
  
    var $items {
      value = $records|get:"items"|safe_array
    }
  
    // Normalize to ES mapping shape
    function.run "elastic_search/prepare_payload" {
      input = {records: $items, person_type: "candidate"}
    } as $prepared
  
    var $payloads {
      value = $prepared.data|safe_array
    }
  
    var $success {
      value = 0
    }
  
    var $failed {
      value = 0
    }
  
    conditional {
      if ($input.push_to_elastic) {
        foreach ($payloads) {
          each as $candidate {
            try_catch {
              try {
                var $doc_id {
                  value = ($candidate.elastic_search_document_id ?? "")
                }
              
                function.run "elastic_search/document" {
                  input = {
                    index : "candidates"
                    method: "PUT"
                    doc_id: $doc_id
                    doc   : $candidate
                  }
                } as $result
              
                var $ok {
                  value = $result.result == "created" || $result.result == "updated" || ($result._id != null)
                }
              
                conditional {
                  if ($ok) {
                    math.add $success {
                      value = 1
                    }
                  }
                
                  else {
                    math.add $failed {
                      value = 1
                    }
                  }
                }
              }
            
              catch {
                math.add $failed {
                  value = 1
                }
              }
            }
          
            // 1s delay between inserts
            util.sleep {
              value = 1
            }
          }
        }
      }
    }
  }

  response = {
    total   : $payloads|count
    prepared: $payloads
    pushed  : $input.push_to_elastic
    success : $success
    failed  : $failed
  }
}