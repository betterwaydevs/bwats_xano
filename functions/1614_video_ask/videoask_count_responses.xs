function "video_ask/videoask_count_responses" {
  input {
    int forms_limit?=50 filters=min:1|max:200
    int responses_limit?=100 filters=min:1|max:200
    text cursor? filters=trim
  }

  stack {
    var $forms_processed {
      value = 0
    }
  
    var $response_totals {
      value = []
    }
  
    var $db_records {
      value = []
    }
  
    db.query videask_response {
      where = $db.videask_response.id != null
      return = {type: "list"}
    } as $db_records
  
    function.run "video_ask/videoask_get_forms" {
      input = {limit: $input.forms_limit, offset: 0}
    } as $forms_response_wrapper
  
    var $forms_response {
      value = $forms_response_wrapper|get:"result":{}
    }
  
    var $forms_body {
      value = $forms_response|get:"result":$forms_response
    }
  
    var $forms_list {
      value = $forms_body|get:"results":[]
    }
  
    foreach ($forms_list) {
      each as $form_item {
        var.update $forms_processed {
          value = $forms_processed + 1
        }
      
        var $form_id {
          value = $form_item|get:"form_id":null
        }
      
        conditional {
          if ($form_id != null && $form_id != "") {
            function.run "video_ask/videoask_collect_form_responses" {
              input = {
                form_id        : $form_id
                responses_limit: $input.responses_limit
                cursor         : $input.cursor
              }
            } as $responses_collection
          
            var $pages {
              value = $responses_collection|get:"pages":[]
            }
          
            var $count {
              value = 0
            }
          
            foreach ($pages) {
              each as $page {
                var $page_results {
                  value = $page|get:"results":[]
                }
              
                foreach ($page_results) {
                  each as $ignored {
                    var.update $count {
                      value = $count + 1
                    }
                  }
                }
              }
            }
          
            var $summary_entry {
              value = {}
                |set:"form_id":$form_id
                |set:"form_title":($form_item|get:"title":null)
                |set:"responses_count":$count
                |set:"db_count":0
            }
          
            var $db_count {
              value = 0
            }
          
            foreach ($db_records) {
              each as $db_record {
                var $interactions {
                  value = $db_record|get:"interactions":[]
                }
              
                foreach ($interactions) {
                  each as $interaction_entry {
                    var $interaction_form_id {
                      value = $interaction_entry|get:"form_id":null
                    }
                  
                    conditional {
                      if ($interaction_form_id == $form_id) {
                        var.update $db_count {
                          value = $db_count + 1
                        }
                      }
                    }
                  }
                }
              }
            }
          
            var.update $summary_entry {
              value = $summary_entry|set:"db_count":$db_count
            }
          
            var.update $response_totals {
              value = $response_totals|push:$summary_entry
            }
          }
        }
      }
    }
  
    var $summary {
      value = {
        forms_processed: $forms_processed
        forms          : $response_totals
      }
    }
  }

  response = $summary
}