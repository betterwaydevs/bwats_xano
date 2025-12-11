function "elastic_search/migrate_dev_data" {
  input {
    // Requested number of prospects to collect (capped at 10,000)
    int prospects_limit?=100
  
    // Requested number of candidates to collect (capped at 10,000)
    int candidates_limit?=100
  
    // When true, immediately push collected payloads into Elasticsearch
    bool push_to_elastic?
  
    // Optional override for the prospects index name
    text prospects_index? filters=trim
  
    // Optional override for the candidates index name
    text candidates_index? filters=trim
  
    // Optional throttle override in milliseconds (default 500ms)
    int? delay_ms?
  }

  stack {
    var $branch_lowercase {
      value = ($env.$branch|json_encode)|to_lower
    }
  
    var $is_dev_branch {
      value = $branch_lowercase|contains:"development"
    }
  
    precondition ($is_dev_branch) {
      error = "This migration helper can only run from a development branch."
    }
  
    // Clamp requested limits (default 100, max 10,000)
    var $prospects_limit {
      value = 100
    }
  
    conditional {
      if ($input.prospects_limit != null && $input.prospects_limit > 0) {
        var.update $prospects_limit {
          value = $input.prospects_limit
        }
      }
    }
  
    conditional {
      if ($prospects_limit > 250) {
        var.update $prospects_limit {
          value = 250
        }
      }
    }
  
    var $candidates_limit {
      value = 100
    }
  
    conditional {
      if ($input.candidates_limit != null && $input.candidates_limit > 0) {
        var.update $candidates_limit {
          value = $input.candidates_limit
        }
      }
    }
  
    conditional {
      if ($candidates_limit > 250) {
        var.update $candidates_limit {
          value = 250
        }
      }
    }
  
    // Fetch randomized prospects
    var $prospects_data {
      value = []
    }
  
    conditional {
      if ($prospects_limit > 0) {
        db.query parsed_prospect {
          sort = {parsed_prospect.id: "rand"}
          return = {
            type  : "list"
            paging: {page: 1, per_page: $prospects_limit}
          }
        
          output = ["id", "elastic_search_document_id"]
        } as $prospects_query_result
      
        var.update $prospects_data {
          value = $prospects_query_result|get:"items"|safe_array
        }
      }
    }
  
    // Fetch randomized candidates
    var $candidates_data {
      value = []
    }
  
    conditional {
      if ($candidates_limit > 0) {
        db.query parsed_candidate {
          sort = {parsed_candidate.id: "rand"}
          return = {
            type  : "list"
            paging: {page: 1, per_page: $candidates_limit}
          }
        
          output = ["id", "elastic_search_document_id"]
        } as $candidates_query_result
      
        var.update $candidates_data {
          value = $candidates_query_result|get:"items"|safe_array
        }
      }
    }
  
    // Prepare response summary
    var $prospects_collected {
      value = $prospects_data|count
    }
  
    var $candidates_collected {
      value = $candidates_data|count
    }
  
    // Determine whether to push into Elasticsearch
    var $push_to_elastic {
      value = false
    }
  
    conditional {
      if ($input.push_to_elastic != null && $input.push_to_elastic) {
        var.update $push_to_elastic {
          value = true
        }
      }
    }
  
    var $prospects_index {
      value = "prospects"
    }
  
    conditional {
      if ($input.prospects_index != null && $input.prospects_index != "") {
        var.update $prospects_index {
          value = $input.prospects_index
        }
      }
    }
  
    var $candidates_index {
      value = "candidates"
    }
  
    conditional {
      if ($input.candidates_index != null && $input.candidates_index != "") {
        var.update $candidates_index {
          value = $input.candidates_index
        }
      }
    }
  
    // Delay in seconds (default 0.5s)
    var $delay_seconds {
      value = 0.5
    }
  
    conditional {
      if ($input.delay_ms != null && $input.delay_ms >= 0) {
        var.update $delay_seconds {
          value = $input.delay_ms / 1000
        }
      }
    }
  
    // Metrics for replay operations
    var $prospects_success {
      value = 0
    }
  
    var $prospects_failed {
      value = 0
    }
  
    var $prospects_errors {
      value = []
    }
  
    var $candidates_success {
      value = 0
    }
  
    var $candidates_failed {
      value = 0
    }
  
    var $candidates_errors {
      value = []
    }
  
    conditional {
      if ($push_to_elastic) {
        foreach ($prospects_data) {
          each as $record {
            try_catch {
              try {
                var $prospect_es_id {
                  value = $record.elastic_search_document_id
                }
              
                // Fetch the document from PRODUCTION ES
                cloud.elasticsearch.document {
                  auth_type = "API Key"
                  key_id = $env.es_key_id
                  access_key = $env.es_access_key
                  region = ""
                  method = "GET"
                  index = "prospects"
                  doc_id = $prospect_es_id
                  doc = {}
                } as $prod_doc
              
                // Extract the _source from the production document
                var $es_payload {
                  value = $prod_doc._source
                }
              
                // Insert into DEV ES using the abstraction (which uses dev credentials)
                function.run "elastic_search/document" {
                  input = {
                    index : $prospects_index
                    method: "PUT"
                    doc_id: $prospect_es_id
                    doc   : $es_payload
                  }
                } as $prospect_insert
              
                var $was_created {
                  value = $prospect_insert != null && ($prospect_insert.result == "created" || $prospect_insert.result == "updated")
                }
              
                conditional {
                  if ($was_created) {
                    math.add $prospects_success {
                      value = 1
                    }
                  }
                
                  else {
                    math.add $prospects_failed {
                      value = 1
                    }
                  
                    array.push $prospects_errors {
                      value = {
                        message : "Unexpected response from Elasticsearch"
                        response: $prospect_insert
                        es_id   : $prospect_es_id
                      }
                    }
                  }
                }
              }
            
              catch {
                math.add $prospects_failed {
                  value = 1
                }
              
                array.push $prospects_errors {
                  value = {
                    message: "ES fetch/insert failed"
                    es_id  : $record.elastic_search_document_id
                  }
                }
              }
            }
          
            conditional {
              if ($delay_seconds != null && $delay_seconds > 0) {
                util.sleep {
                  value = $delay_seconds
                }
              }
            }
          }
        }
      
        foreach ($candidates_data) {
          each as $record {
            try_catch {
              try {
                var $candidate_es_id {
                  value = $record.elastic_search_document_id
                }
              
                // Fetch the document from PRODUCTION ES
                cloud.elasticsearch.document {
                  auth_type = "API Key"
                  key_id = $env.es_key_id
                  access_key = $env.es_access_key
                  region = ""
                  method = "GET"
                  index = "candidates"
                  doc_id = $candidate_es_id
                  doc = {}
                } as $prod_doc
              
                // Extract the _source from the production document
                var $es_payload {
                  value = $prod_doc._source
                }
              
                // Insert into DEV ES using the abstraction (which uses dev credentials)
                function.run "elastic_search/document" {
                  input = {
                    index : $candidates_index
                    method: "PUT"
                    doc_id: $candidate_es_id
                    doc   : $es_payload
                  }
                } as $candidate_insert
              
                var $candidate_created {
                  value = $candidate_insert != null && ($candidate_insert.result == "created" || $candidate_insert.result == "updated")
                }
              
                conditional {
                  if ($candidate_created) {
                    math.add $candidates_success {
                      value = 1
                    }
                  }
                
                  else {
                    math.add $candidates_failed {
                      value = 1
                    }
                  
                    array.push $candidates_errors {
                      value = {
                        message : "Unexpected response from Elasticsearch"
                        response: $candidate_insert
                        es_id   : $candidate_es_id
                      }
                    }
                  }
                }
              }
            
              catch {
                math.add $candidates_failed {
                  value = 1
                }
              
                array.push $candidates_errors {
                  value = {
                    message: "ES fetch/insert failed"
                    es_id  : $record.elastic_search_document_id
                  }
                }
              }
            }
          
            conditional {
              if ($delay_seconds != null && $delay_seconds > 0) {
                util.sleep {
                  value = $delay_seconds
                }
              }
            }
          }
        }
      }
    }
  
    var $result {
      value = {}
    }
  
    var.update $result {
      value = $result
        |set:"branch":$env.$branch
        |set:"prospects":{requested: $prospects_limit, collected: $prospects_collected, data: $prospects_data}
        |set:"candidates":{requested: $candidates_limit, collected: $candidates_collected, data: $candidates_data}
    }
  
    conditional {
      if ($push_to_elastic) {
        var $elastic_replay_summary {
          value = {
            delay_ms  : $delay_ms
            prospects : {
              attempted: $prospects_collected,
              success: $prospects_success,
              failed: $prospects_failed,
              errors: $prospects_errors
            }
            candidates: {
              attempted: $candidates_collected,
              success: $candidates_success,
              failed: $candidates_failed,
              errors: $candidates_errors
            }
          }
        }
      
        var.update $result {
          value = $result
            |set:"elastic_replay":$elastic_replay_summary
        }
      }
    }
  }

  response = $result
}