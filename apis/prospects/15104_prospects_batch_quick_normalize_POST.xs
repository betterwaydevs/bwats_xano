query "prospects/batch_quick_normalize" verb=POST {
  api_group = "prospects"
  auth = "user"

  input {
  }

  stack {
    db.query parsed_prospect {
      where = $db.parsed_prospect.is_quick_normalized == false && $db.parsed_prospect.parse_status == "parsed" && $db.parsed_prospect.skills != null
      sort = {parsed_prospect.created_at: "desc"}
      return = {
        type  : "list"
        paging: {page: 1, per_page: 2000, metadata: false}
      }
    
      output = ["id", "skills"]
    } as $pending
  
    var $queued_executions {
      value = []
    }
  
    var $queued_ids {
      value = []
    }
  
    var $executions {
      value = []
    }
  
    var $summary {
      value = {processed: 0, success: 0, failed: []}
    }
  
    foreach ($pending) {
      each as $prospect {
        try_catch {
          try {
            function.run prospect_quick_normalize_skills {
              runtime_mode = "async-shared"
              input = {prospect_id: $prospect.id}
            } as $execution_id
          
            var.update $queued_executions {
              value = $queued_executions
                |push:{prospect_id: $prospect.id, execution_id: $execution_id}
            }
          
            var.update $queued_ids {
              value = $queued_ids|push:$prospect.id
            }
          }
        
          catch {
            var.update $executions {
              value = $executions
                |push:{prospect_id: $prospect.id, execution_id: null, normalized: false, error: $error.message}
            }
          
            var.update $summary {
              value = $summary
                |set:"processed":($summary.processed + 1)
                |set:"failed":```
                  ($summary.failed
                                    |push:{
                                      prospect_id: $prospect.id
                                      reason     : $error.message
                                    }
                                  )
                  ```
            }
          }
        }
      }
    }
  
    conditional {
      if (($queued_executions|count) > 0) {
        util.sleep {
          value = 300
        }
      
        db.query parsed_prospect {
          where = $db.parsed_prospect.id in $queued_ids
          return = {
            type  : "list"
            paging: {page: 1, per_page: 100, metadata: false}
          }
        
          output = ["id", "is_quick_normalized"]
        } as $prospect_statuses
      
        foreach ($queued_executions) {
          each as $queued_job {
            var $matching_status {
              value = $prospect_statuses
                |find:($this.id == $queued_job.prospect_id)
            }
          
            var $is_normalized {
              value = ($matching_status != null && $matching_status.is_quick_normalized == true)
            }
          
            conditional {
              if ($is_normalized) {
                var.update $executions {
                  value = $executions
                    |push:```
                      {
                        prospect_id : $queued_job.prospect_id
                        execution_id: $queued_job.execution_id
                        normalized  : true
                        error       : null
                      }
                      ```
                }
              
                var.update $summary {
                  value = $summary
                    |set:"processed":($summary.processed + 1)
                    |set:"success":($summary.success + 1)
                }
              }
            
              else {
                var.update $executions {
                  value = $executions
                    |push:```
                      {
                        prospect_id : $queued_job.prospect_id
                        execution_id: $queued_job.execution_id
                        normalized  : false
                        error       : "Normalization not completed before status check"
                      }
                      ```
                }
              
                var.update $summary {
                  value = $summary
                    |set:"processed":($summary.processed + 1)
                    |set:"failed":```
                      ($summary.failed
                                            |push:{
                                              prospect_id: $queued_job.prospect_id
                                              reason     : "Normalization not completed before status check"
                                            })
                      ```
                }
              }
            }
          }
        }
      }
    }
  }

  response = {
    pending   : $pending
    executions: $executions
    summary   : $summary
  }
}