function "video_ask/videoask_sync_all" {
  input {
    int forms_limit?=50 filters=min:1|max:200
    json form_ids?
  }

  stack {
    var $forms_processed {
      value = 0
    }
  
    var $contacts_processed {
      value = 0
    }
  
    var $per_form_summaries {
      value = []
    }
  
    var $forms_list {
      value = []
    }
  
    conditional {
      if ($input.form_ids != null) {
        var $manual_forms {
          value = []
        }
      
        foreach ($input.form_ids) {
          each as $manual_form_id {
            conditional {
              if ($manual_form_id != null && $manual_form_id != "") {
                var $manual_entry {
                  value = {}
                    |set:"form_id":$manual_form_id
                    |set:"title":null
                }
              
                var.update $manual_forms {
                  value = $manual_forms|push:$manual_entry
                }
              }
            }
          }
        }
      
        var.update $forms_list {
          value = $manual_forms
        }
      }
    
      else {
        function.run "video_ask/videoask_get_forms" {
          input = {limit: $input.forms_limit, offset: 0}
        } as $forms_response_wrapper
      
        var $forms_response {
          value = $forms_response_wrapper|get:"result":{}
        }
      
        var $forms_body {
          value = $forms_response|get:"result":$forms_response
        }
      
        var.update $forms_list {
          value = $forms_body|get:"results":[]
        }
      }
    }
  
    foreach ($forms_list) {
      each as $form_item {
        var $form_id {
          value = $form_item|get:"form_id":null
        }
      
        conditional {
          if ($form_id != null && $form_id != "") {
            var.update $forms_processed {
              value = $forms_processed + 1
            }
          
            function.run "video_ask/videoask_collect_form_responses" {
              input = {form_id: $form_id}
            } as $responses_collection
          
            var $response_pages {
              value = $responses_collection|get:"pages":[]
            }
          
            var $form_contacts_total {
              value = 0
            }
          
            var $form_contacts_processed {
              value = 0
            }
          
            foreach ($response_pages) {
              each as $response_page {
                function.run "video_ask/videoask_process_responses" {
                  input = {
                    form_id   : $form_id
                    form_title: $form_item|get:"title":null
                    responses : $response_page
                  }
                } as $page_summary
              
                var $page_total {
                  value = $page_summary|get:"contacts_total":0
                }
              
                var $page_processed {
                  value = $page_summary|get:"contacts_processed":0
                }
              
                var.update $form_contacts_total {
                  value = $form_contacts_total + $page_total
                }
              
                var.update $form_contacts_processed {
                  value = $form_contacts_processed + $page_processed
                }
              }
            }
          
            var.update $contacts_processed {
              value = $contacts_processed + $form_contacts_processed
            }
          
            var $form_summary_entry {
              value = {}
                |set:"form_id":$form_id
                |set:"form_title":($form_item|get:"title":null)
                |set:"contacts_total":$form_contacts_total
                |set:"contacts_processed":$form_contacts_processed
            }
          
            var.update $per_form_summaries {
              value = $per_form_summaries|push:$form_summary_entry
            }
          }
        }
      }
    }
  
    var $summary {
      value = {
        forms_processed   : $forms_processed
        contacts_processed: $contacts_processed
        per_form          : $per_form_summaries
      }
    }
  }

  response = $summary
}