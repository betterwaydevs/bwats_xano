function "video_ask/videoask_fetch_forms_with_responses" {
  input {
    int forms_limit?=20
    int responses_limit?=50
    text cursor? filters=trim
  }

  stack {
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
  
    var $forms_processed {
      value = 0
    }
  
    var $aggregated {
      value = []
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
          
            var $response_pages {
              value = $responses_collection|get:"pages":[]
            }
          
            var $aggregated_item {
              value = {}
                |set:"form":$form_item
                |set:"response_pages":$response_pages
            }
          
            var.update $aggregated {
              value = $aggregated|push:$aggregated_item
            }
          }
        }
      }
    }
  
    var $summary {
      value = {forms_processed: $forms_processed, data: $aggregated}
    }
  }

  response = $summary
}