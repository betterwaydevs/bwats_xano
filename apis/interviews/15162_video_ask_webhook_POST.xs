// Add video_ask_webhook record
query video_ask_webhook verb=POST {
  input {
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    var $post_params {
      value = $raw_input
    }
  
    var $get_params {
      value = {}
    }
  
    conditional {
      if ($env.$request_querystring != null && $env.$request_querystring != "") {
        api.lambda {
          code = """
              const querystring = ($env.$request_querystring || '').replace(/^\?/, '');
              const params = {};
              if (querystring.length > 0) {
                const pairs = querystring.split('&');
                for (const pair of pairs) {
                  if (!pair) continue;
                  const [rawKey, rawValue = ''] = pair.split('=');
                  const key = decodeURIComponent(rawKey || '').trim();
                  if (!key) continue;
                  const value = decodeURIComponent(rawValue || '');
                  if (Object.prototype.hasOwnProperty.call(params, key)) {
                    if (Array.isArray(params[key])) {
                      params[key].push(value);
                    } else {
                      params[key] = [params[key], value];
                    }
                  } else {
                    params[key] = value;
                  }
                }
              }
              return { params };
            """
          timeout = 5
        } as $query_parse
      
        var.update $get_params {
          value = $query_parse.params
        }
      }
    }
  
    db.add video_ask_webhook {
      data = {
        created_at : now
        get_params : $get_params
        post_params: $post_params
      }
    } as $model
  
    var $event_type {
      value = $post_params|get:"event_type":null
    }
  
    var $form_payload {
      value = $post_params|get:"form":null
    }
  
    var $contact_payload {
      value = $post_params|get:"contact":null
    }
  
    var $form_id {
      value = $form_payload|get:"form_id":null
    }
  
    var $form_title {
      value = $form_payload|get:"title":null
    }
  
    var $contact_email {
      value = $contact_payload|get:"email":null
    }
  
    conditional {
      if ($event_type == "form_response" && $contact_payload != null && $contact_email != null && $contact_email != "" && $form_id != null && $form_id != "") {
        var $interaction {
          value = {}
            |set:"form_id":$form_id
            |set:"form_title":$form_title
            |set:"contact_id":($contact_payload|get:"contact_id":null)
            |set:"respondent_id":($contact_payload|get:"respondent_id":null)
            |set:"name":($contact_payload|get:"name":null)
            |set:"email":$contact_email
            |set:"status":($contact_payload|get:"status":null)
            |set:"platform":($contact_payload|get:"platform":null)
            |set:"share_url":($contact_payload|get:"share_url":null)
            |set:"thumbnail":($contact_payload|get:"thumbnail":null)
            |set:"transcription":($contact_payload|get:"transcription":null)
            |set:"created_at":($contact_payload|get:"created_at":null)
            |set:"updated_at":($contact_payload|get:"updated_at":null)
            |set:"tags":($contact_payload|get:"tags":[])
            |set:"variables":($contact_payload|get:"variables":null)
            |set:"answers":($contact_payload|get:"answers":[])
        }
      
        var $interaction_contact_id {
          value = $interaction|get:"contact_id":null
        }
      
        var $interaction_respondent_id {
          value = $interaction|get:"respondent_id":null
        }
      
        var $now {
          value = now
        }
      
        var $existing_record {
          value = null
        }
      
        db.query videask_response {
          where = $db.videask_response.email == $contact_email
          return = {type: "single"}
        } as $existing_record
      
        conditional {
          if ($existing_record != null) {
            var $existing_interactions {
              value = []
            }
          
            conditional {
              if ($existing_record.interactions != null) {
                var.update $existing_interactions {
                  value = $existing_record.interactions
                }
              }
            }
          
            var $merged_interactions {
              value = []
            }
          
            foreach ($existing_interactions) {
              each as $existing_entry {
                conditional {
                  if ($existing_entry|is_object) {
                    var.update $merged_interactions {
                      value = $merged_interactions|push:$existing_entry
                    }
                  }
                }
              }
            }
          
            var.update $existing_interactions {
              value = $merged_interactions
            }
          
            var $has_match {
              value = false
            }
          
            foreach ($existing_interactions) {
              each as $existing_entry {
                conditional {
                  if ($has_match == false) {
                    var $existing_form_id {
                      value = $existing_entry|get:"form_id":null
                    }
                  
                    var $existing_contact_id {
                      value = $existing_entry|get:"contact_id":null
                    }
                  
                    var $existing_respondent_id {
                      value = $existing_entry|get:"respondent_id":null
                    }
                  
                    conditional {
                      if ($existing_form_id == $form_id) {
                        conditional {
                          if ($existing_contact_id == $interaction_contact_id) {
                            conditional {
                              if ($existing_respondent_id == $interaction_respondent_id) {
                                var.update $has_match {
                                  value = true
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          
            conditional {
              if ($has_match == false) {
                var.update $existing_interactions {
                  value = $existing_interactions|push:$interaction
                }
              }
            }
          
            db.edit videask_response {
              field_name = "id"
              field_value = $existing_record.id
              data = {
                interactions  : $existing_interactions
                last_synced_at: $now
                updated_at    : $now
              }
            } as $updated_videask_response
          }
        
          else {
            var $new_interactions {
              value = []|push:$interaction
            }
          
            db.add videask_response {
              data = {
                email         : $contact_email
                interactions  : $new_interactions
                last_synced_at: $now
                updated_at    : $now
              }
            } as $created_videask_response
          }
        }
      }
    }
  }

  response = $model
}