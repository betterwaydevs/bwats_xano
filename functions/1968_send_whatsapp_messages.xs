// Main function to send WhatsApp messages to prospects and candidates
function send_whatsapp_messages {
  input {
    // Array of {person_id, person_type}
    json person_ids
  
    int project_id
    bool? use_sandbox
  }

  stack {
    // Validate inputs
    precondition ($input.person_ids != null && $input.person_ids.count > 0) {
      error = "person_ids array is required"
    }
  
    precondition ($input.project_id != null && $input.project_id > 0) {
      error = "project_id is required"
    }
  
    // Initialize result tracking
    var $results {
      value = []
    }
  
    var $sent_count {
      value = 0
    }
  
    var $association_updated_count {
      value = 0
    }
  
    // PHASE 1 & 2: Split by person_type and batch fetch
    var $prospect_ids {
      value = []
    }
  
    var $candidate_ids {
      value = []
    }
  
    var $has_prospects {
      value = false
    }
  
    var $has_candidates {
      value = false
    }
  
    var $total_people {
      value = 0
    }
  
    var $use_sandbox_flag {
      value = false
    }
  
    conditional {
      if ($input.use_sandbox != null) {
        var.update $use_sandbox_flag {
          value = $input.use_sandbox
        }
      }
    }
  
    // Fetch project for template/application info
    db.query project {
      where = $db.project.id == $input.project_id
      return = {type: "single"}
      output = ["id", "name", "messaging_template"]
    } as $project
  
    precondition ($project != null) {
      error = "Project not found"
    }
  
    // Split person_ids by type
    foreach ($input.person_ids) {
      each as $person_item {
        var.update $total_people {
          value = $total_people + 1
        }
      
        conditional {
          if ($person_item.person_type == "prospect") {
            array.push $prospect_ids {
              value = $person_item.person_id
            }
          
            var.update $has_prospects {
              value = true
            }
          }
        
          else {
            conditional {
              if ($person_item.person_type == "candidate") {
                array.push $candidate_ids {
                  value = $person_item.person_id
                }
              
                var.update $has_candidates {
                  value = true
                }
              }
            }
          }
        }
      }
    }
  
    // Batch fetch prospects
    conditional {
      if ($has_prospects) {
        db.query parsed_prospect {
          where = $db.parsed_prospect.id in $prospect_ids
          return = {type: "list"}
          output = ["id", "phone_number", "country", "first_name", "last_name"]
        } as $prospects
      }
    }
  
    // Batch fetch candidates
    conditional {
      if ($has_candidates) {
        db.query parsed_candidate {
          where = $db.parsed_candidate.id in $candidate_ids
          return = {type: "list"}
          output = ["id", "phone_number", "country", "first_name", "last_name"]
        } as $candidates
      }
    }
  
    // PHASE 3: Send messages one by one with delays
    foreach ($input.person_ids) {
      each as $person_input {
        var $person {
          value = null
        }
      
        // Find the person record
        conditional {
          if ($person_input.person_type == "prospect" && $prospects != null) {
            foreach ($prospects) {
              each as $p {
                conditional {
                  if ($p.id == $person_input.person_id) {
                    var.update $person {
                      value = $p
                    }
                  }
                }
              }
            }
          }
        
          else {
            conditional {
              if ($person_input.person_type == "candidate" && $candidates != null) {
                foreach ($candidates) {
                  each as $c {
                    conditional {
                      if ($c.id == $person_input.person_id) {
                        var.update $person {
                          value = $c
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      
        var $send_status {
          value = "skipped"
        }
      
        var $send_message {
          value = "Person not found"
        }
      
        var $association_status {
          value = "not_attempted"
        }
      
        var $association_message {
          value = ""
        }
      
        var $delivery_status {
          value = null
        }
      
        var $last_delivery_check {
          value = null
        }
      
        // Process if person found
        conditional {
          if ($person != null) {
            var $phone {
              value = $person.phone_number|trim
            }
          
            // Validate phone exists
            conditional {
              if ($phone == null || $phone == "") {
                var.update $send_status {
                  value = "skipped"
                }
              
                var.update $send_message {
                  value = "No phone number"
                }
              }
            
              else {
                // Prepare personalized message from project template
                var $message_template {
                  value = $project.messaging_template
                }
              
                conditional {
                  if ($message_template == null || $message_template == "") {
                    var.update $send_status {
                      value = "skipped"
                    }
                  
                    var.update $send_message {
                      value = "Project template missing"
                    }
                  
                    array.push $results {
                      value = {
                        person_id            : $person_input.person_id
                        person_type          : $person_input.person_type
                        project_id           : $input.project_id
                        send_status          : $send_status
                        send_message         : $send_message
                        association_status   : $association_status
                        association_message  : $association_message
                        delivery_status      : $delivery_status
                        last_delivery_payload: $last_delivery_check
                      }
                    }
                  
                    continue
                  }
                }
              
                var $person_first_name {
                  value = ($person.first_name != null && $person.first_name != "" ? $person.first_name : ($person.last_name != null && $person.last_name != "" ? $person.last_name : ""))
                }
              
                var $project_title {
                  value = ($project.name != null && $project.name != "" ? $project.name : "")
                }
              
                var $project_name_for_slug {
                  value = ($project_title != null && $project_title != "" ? $project_title : "project")
                }
              
                api.lambda {
                  code = """
                      const title = ($var.project_name_for_slug || '').toString().toLowerCase();
                      const normalized = title
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9\s-]/g, ' ')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return normalized || 'project';
                    """
                  timeout = 5
                } as $project_slug
              
                var $apply_link {
                  value = "https://jobs.betterway.dev/job/"
                    |concat:$project_slug
                    |concat:"-"
                    |concat:$project.id
                }
              
                var $personalized_message {
                  value = $message_template
                    |replace:"{{candidate_first_name}}":$person_first_name
                    |replace:"{{project_title}}":$project_title
                    |replace:"{{apply_link}}":$apply_link
                }
              
                // Check if country code needed
                conditional {
                  if ($phone|starts_with:"+" == false) {
                    // Get country code from country field
                    function.run get_country_code {
                      input = {country: $person.country}
                    } as $country_code
                  
                    conditional {
                      if ($country_code != null && $country_code != "") {
                        var.update $phone {
                          value = $country_code|concat:$phone
                        }
                      }
                    }
                  }
                }
              
                // Send WhatsApp message
                // TODO: Move use_sandbox flag to environment variable/input toggle
                function.run whatsapp_api_wrapper {
                  input = {
                    action         : "send_message"
                    phone_number   : $phone
                    message_body   : $personalized_message
                    message_id     : ""
                    typing_time    : 0
                    no_link_preview: false
                    quoted         : ""
                    count          : 20
                    offset         : 0
                    use_sandbox    : $use_sandbox_flag
                  }
                } as $send_result
              
                conditional {
                  if ($send_result.sent) {
                    var.update $send_status {
                      value = "success"
                    }
                  
                    var.update $send_message {
                      value = "Sent to "|concat:$phone
                    }
                  
                    var.update $delivery_status {
                      value = "pending"
                    }
                  
                    // Wait 5 seconds then poll for status
                    api.lambda {
                      code = """
                          const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                          await sleep(5000);
                          return true;
                        """
                      timeout = 10
                    } as $delivery_delay
                  
                    conditional {
                      if ($send_result.message != null && $send_result.message.id != null && $send_result.message.id != "") {
                        function.run whatsapp_api_wrapper {
                          input = {
                            action      : "get_message"
                            phone_number: $phone
                            message_id  : $send_result.message.id
                            use_sandbox : $use_sandbox_flag
                          }
                        } as $delivery_result
                      
                        conditional {
                          if ($delivery_result != null && $delivery_result.status != null && $delivery_result.status != "") {
                            var.update $delivery_status {
                              value = $delivery_result.status
                            }
                          }
                        }
                      
                        var.update $last_delivery_check {
                          value = $delivery_result
                        }
                      
                        conditional {
                          if ($delivery_status == null || $delivery_status == "" || $delivery_status == "pending") {
                            function.run whatsapp_api_wrapper {
                              input = {
                                action      : "get_message"
                                phone_number: $phone
                                message_id  : $send_result.message.id
                                use_sandbox : $use_sandbox_flag
                                resync      : true
                              }
                            } as $delivery_resync_result
                          
                            conditional {
                              if ($delivery_resync_result != null && $delivery_resync_result.status != null && $delivery_resync_result.status != "") {
                                var.update $delivery_status {
                                  value = $delivery_resync_result.status
                                }
                              }
                            }
                          
                            var.update $last_delivery_check {
                              value = $delivery_resync_result
                            }
                          }
                        }
                      }
                    }
                  
                    var.update $sent_count {
                      value = $sent_count + 1
                    }
                  
                    // PHASE 4: Update association for successful sends
                    db.query project_person_association {
                      where = $db.project_person_association.person_id == $person_input.person_id && $db.project_person_association.person_type == $person_input.person_type && $db.project_person_association.project_id == $input.project_id
                      return = {type: "single"}
                    } as $association
                  
                    conditional {
                      if ($association != null) {
                        // Find stage with linkedin_connection action (prefer matching type, allow fallback)
                        var $preferred_stage_type {
                          value = ($person_input.person_type == "candidate" ? "candidates" : "prospects")
                        }
                      
                        var $target_stage {
                          value = null
                        }
                      
                        db.query stage {
                          where = $db.stage.project_id == $input.project_id && $db.stage.stage_action == "linkedin_connection" && $db.stage.stage_type == $preferred_stage_type
                          return = {type: "single"}
                        } as $primary_stage
                      
                        conditional {
                          if ($primary_stage != null) {
                            var.update $target_stage {
                              value = $primary_stage
                            }
                          }
                        }
                      
                        conditional {
                          if ($target_stage == null) {
                            db.query stage {
                              where = $db.stage.project_id == $input.project_id && $db.stage.stage_action == "linkedin_connection"
                              return = {type: "single"}
                            } as $fallback_stage
                          
                            conditional {
                              if ($fallback_stage != null) {
                                var.update $target_stage {
                                  value = $fallback_stage
                                }
                              }
                            }
                          }
                        }
                      
                        conditional {
                          if ($target_stage != null) {
                            // Update stage
                            function.run association_project_change_stage {
                              input = {
                                project_person_association_id: $association.id
                                notes                        : $personalized_message
                                activity_type                : "whatsapp_message"
                                stage_id                     : $target_stage.id
                                user_id                      : $auth.id
                              }
                            } as $stage_update
                          
                            var.update $association_status {
                              value = "updated"
                            }
                          
                            var.update $association_message {
                              value = "Moved to "|concat:$target_stage.name
                            }
                          
                            var.update $association_updated_count {
                              value = $association_updated_count + 1
                            }
                          }
                        
                          else {
                            var.update $association_status {
                              value = "no_stage"
                            }
                          
                            var.update $association_message {
                              value = "No stage with linkedin_connection action found"
                            }
                          }
                        }
                      }
                    
                      else {
                        var.update $association_status {
                          value = "no_association"
                        }
                      
                        var.update $association_message {
                          value = "No association found for this project"
                        }
                      }
                    }
                  }
                
                  else {
                    var $send_result_copy {
                      value = $send_result
                    }
                  
                    api.lambda {
                      code = """
                          const result = $var.send_result_copy;
                          try {
                            return JSON.stringify(result);
                          } catch (error) {
                            return String(result);
                          }
                        """
                      timeout = 5
                    } as $provider_response_text
                  
                    var.update $send_status {
                      value = "failed"
                    }
                  
                    var.update $send_message {
                      value = "Message not sent (Provider response: "
                        |concat:$provider_response_text
                        |concat:")"
                    }
                  }
                }
              
                // Wait 5 seconds before next send (anti-spam)
                api.lambda {
                  code = """
                      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                      await sleep(5000);
                      return true;
                    """
                  timeout = 10
                } as $delay
              }
            }
          }
        }
      
        // Track result
        array.push $results {
          value = {
            person_id            : $person_input.person_id
            person_type          : $person_input.person_type
            project_id           : $input.project_id
            send_status          : $send_status
            send_message         : $send_message
            association_status   : $association_status
            association_message  : $association_message
            delivery_status      : $delivery_status
            last_delivery_payload: $last_delivery_check
          }
        }
      }
    }
  }

  response = {
    total                    : $total_people
    sent_count               : $sent_count
    association_updated_count: $association_updated_count
    results                  : $results
  }
}