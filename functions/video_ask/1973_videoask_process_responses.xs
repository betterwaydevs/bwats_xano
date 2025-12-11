function "video_ask/videoask_process_responses" {
  input {
    text form_id filters=trim
    text form_title? filters=trim
    json responses
  }

  stack {
    var $responses_body {
      value = $input.responses|get:"result":$input.responses
    }
  
    var $contacts {
      value = $responses_body|get:"results":[]
    }
  
    var $contacts_total {
      value = 0
    }
  
    var $contacts_processed {
      value = 0
    }
  
    foreach ($contacts) {
      each as $contact {
        var.update $contacts_total {
          value = $contacts_total + 1
        }
      
        var $email {
          value = $contact|get:"email":null
        }
      
        conditional {
          if ($email != null && $email != "") {
            var $interaction {
              value = {}
                |set:"form_id":$input.form_id
                |set:"form_title":$input.form_title
                |set:"contact_id":($contact|get:"contact_id":null)
                |set:"respondent_id":($contact|get:"respondent_id":null)
                |set:"name":($contact|get:"name":null)
                |set:"email":$email
                |set:"status":($contact|get:"status":null)
                |set:"platform":($contact|get:"platform":null)
                |set:"share_url":($contact|get:"share_url":null)
                |set:"thumbnail":($contact|get:"thumbnail":null)
                |set:"transcription":($contact|get:"transcription":null)
                |set:"created_at":($contact|get:"created_at":null)
                |set:"updated_at":($contact|get:"updated_at":null)
                |set:"tags":($contact|get:"tags":[])
                |set:"variables":($contact|get:"variables":null)
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
              where = $db.videask_response.email == $email
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
                          if ($existing_form_id == $input.form_id) {
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
                } as $updated_record
              }
            
              else {
                var $new_interactions {
                  value = []|push:$interaction
                }
              
                db.add videask_response {
                  data = {
                    email         : $email
                    interactions  : $new_interactions
                    last_synced_at: $now
                    updated_at    : $now
                  }
                } as $created_record
              }
            }
          
            var.update $contacts_processed {
              value = $contacts_processed + 1
            }
          }
        }
      }
    }
  
    var $summary {
      value = {
        form_id           : $input.form_id
        form_title        : $input.form_title
        contacts_total    : $contacts_total
        contacts_processed: $contacts_processed
      }
    }
  }

  response = $summary
}