function "communications/send_email_message" {
  input {
    // Array of {person_id, person_type}
    json person_ids
  
    int project_id
    int? user_id
  }

  stack {
    // Validate inputs
    precondition ($input.person_ids != null && $input.person_ids.count > 0) {
      error = "person_ids array is required"
    }
  
    precondition ($input.project_id != null && $input.project_id > 0) {
      error = "project_id is required"
    }
  
    // Result trackers
    var $results {
      value = []
    }
  
    var $sent_count {
      value = 0
    }
  
    var $association_updated_count {
      value = 0
    }
  
    var $total_people {
      value = 0
    }
  
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
  
    // Fetch project + template info
    db.query project {
      where = $db.project.id == $input.project_id
      return = {type: "single"}
      output = ["id", "name", "messaging_template", "email_template"]
    } as $project
  
    precondition ($project != null) {
      error = "Project not found"
    }
  
    var $effective_user_id {
      value = ($input.user_id != null && $input.user_id > 0 ? $input.user_id : ($auth != null ? $auth.id : null))
    }
  
    precondition ($effective_user_id != null && $effective_user_id > 0) {
      error = "Authenticated user required"
    }
  
    var $project_name {
      value = ($project.name != null && $project.name != "" ? $project.name : "Project")
    }
  
    var $raw_email_template {
      value = ($project.email_template != null && $project.email_template != "" ? $project.email_template : $project.messaging_template)
    }
  
    precondition ($raw_email_template != null && $raw_email_template != "") {
      error = "Project email template is required"
    }
  
    var $template_subject {
      value = null
    }
  
    var $template_body {
      value = null
    }
  
    api.lambda {
      code = """
          const template = $var.raw_email_template || '';
          try {
            const parsed = JSON.parse(template);
            if (parsed && typeof parsed === 'object') {
              return {
                is_json: true,
                subject: parsed.subject || '',
                body: parsed.body || ''
              };
            }
          } catch (error) {}
          return { is_json: false };
        """
      timeout = 5
    } as $parsed_email_template
  
    conditional {
      if ($parsed_email_template != null && $parsed_email_template.is_json) {
        var.update $template_subject {
          value = ($parsed_email_template.subject != null && $parsed_email_template.subject != "" ? $parsed_email_template.subject : null)
        }
      
        var.update $template_body {
          value = ($parsed_email_template.body != null && $parsed_email_template.body != "" ? $parsed_email_template.body : null)
        }
      }
    }
  
    var $raw_html_template {
      value = ($template_body != null && $template_body != "" ? $template_body : $raw_email_template)
    }
  
    precondition ($raw_html_template != null && $raw_html_template != "") {
      error = "Project email body is required"
    }
  
    api.lambda {
      code = """
          const template = $var.raw_html_template || '';
          const trimmed = template.trim();
          const looksLikeHtml = /<[^>]+>/.test(trimmed);
          if (looksLikeHtml) {
            return trimmed
              .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '<p></p>')
              .replace(/(<br\s*\/?>\s*){2,}/gi, '<br>')
              .replace(/\s+<\/p>/gi, '</p>')
              .replace(/\s+<br/gi, ' <br');
          }
          return trimmed
            .replace(/\r\n/g, '<br>')
            .replace(/\n/g, '<br>');
        """
      timeout = 5
    } as $normalized_html_template
  
    var $base_html_template {
      value = $normalized_html_template
    }
  
    api.lambda {
      code = """
          const html = $var.base_html_template || '';
          const withBreaks = html.replace(/<br\s*\/?>/gi, '\n');
          const withoutTags = withBreaks.replace(/<[^>]+>/g, '');
          return withoutTags;
        """
      timeout = 5
    } as $base_text_template
  
    var $base_subject_template {
      value = ($template_subject != null && $template_subject != "" ? $template_subject : ("Opportunity: "|concat:$project_name))
    }
  
    var $from_header {
      value = "Laura Pulgarin <laura@email.betterway.dev>"
    }
  
    var $sender_email_only {
      value = "laura@email.betterway.dev"
    }
  
    // Split person_ids by type for batch fetch
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
  
    conditional {
      if ($has_prospects) {
        db.query parsed_prospect {
          where = $db.parsed_prospect.id in $prospect_ids
          return = {type: "list"}
          output = ["id", "email", "first_name", "last_name", "public_name", "country"]
        } as $prospects
      }
    }
  
    conditional {
      if ($has_candidates) {
        db.query parsed_candidate {
          where = $db.parsed_candidate.id in $candidate_ids
          return = {type: "list"}
          output = ["id", "email", "first_name", "last_name", "public_name", "country"]
        } as $candidates
      }
    }
  
    // Iterate through requested people preserving order
    foreach ($input.person_ids) {
      each as $person_input {
        var $person {
          value = null
        }
      
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
      
        conditional {
          if ($person != null) {
            var $email_address {
              value = ($person.email != null ? ($person.email|trim) : null)
            }
          
            conditional {
              if ($email_address != null && $email_address != "") {
                api.lambda {
                  code = """
                      const email = ($var.email_address || '').trim();
                      return email.toLowerCase();
                    """
                  timeout = 5
                } as $lowercase_email
              
                var.update $email_address {
                  value = $lowercase_email
                }
              }
            }
          
            conditional {
              if ($email_address == null || $email_address == "") {
                var.update $send_status {
                  value = "skipped"
                }
              
                var.update $send_message {
                  value = "No email address"
                }
              }
            
              else {
                var $person_first_name {
                  value = ($person.first_name != null && $person.first_name != "" ? $person.first_name : ($person.public_name != null && $person.public_name != "" ? $person.public_name : ($person.last_name != null && $person.last_name != "" ? $person.last_name : "")))
                }
              
                var $project_name_for_slug {
                  value = ($project_name != null && $project_name != "" ? $project_name : "project")
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
              
                var $personalized_subject {
                  value = $base_subject_template
                    |replace:"{{candidate_first_name}}":$person_first_name
                    |replace:"{{project_title}}":$project_name
                    |replace:"{{apply_link}}":$apply_link
                }
              
                var $personalized_html {
                  value = $base_html_template
                    |replace:"{{candidate_first_name}}":$person_first_name
                    |replace:"{{project_title}}":$project_name
                    |replace:"{{apply_link}}":$apply_link
                }
              
                var $personalized_text {
                  value = $base_text_template
                    |replace:"{{candidate_first_name}}":$person_first_name
                    |replace:"{{project_title}}":$project_name
                    |replace:"{{apply_link}}":$apply_link
                }
              
                function.run "communications/resend_email_wrapper" {
                  input = {
                    to     : $email_address
                    subject: $personalized_subject
                    html   : $personalized_html
                    text   : $personalized_text
                    from   : $from_header
                  }
                } as $send_result
              
                var $was_sent {
                  value = ($send_result != null && (($send_result.sent != null && $send_result.sent) || ($send_result.success != null && $send_result.success)))
                }
              
                conditional {
                  if ($was_sent) {
                    var.update $send_status {
                      value = "success"
                    }
                  
                    var.update $send_message {
                      value = "Sent to "|concat:$email_address
                    }
                  
                    var.update $sent_count {
                      value = $sent_count + 1
                    }
                  
                    db.query project_person_association {
                      where = $db.project_person_association.person_id == $person_input.person_id && $db.project_person_association.person_type == $person_input.person_type && $db.project_person_association.project_id == $input.project_id
                      return = {type: "single"}
                    } as $association
                  
                    conditional {
                      if ($association != null) {
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
                            function.run association_project_change_stage {
                              input = {
                                project_person_association_id: $association.id
                                notes                        : $personalized_html
                                activity_type                : "email_sent"
                                stage_id                     : $target_stage.id
                                user_id                      : $effective_user_id
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
                      value = "Email not sent (Provider response: "
                        |concat:$provider_response_text
                        |concat:")"
                    }
                  }
                }
              }
            }
          }
        }
      
        array.push $results {
          value = {
            person_id          : $person_input.person_id
            person_type        : $person_input.person_type
            project_id         : $input.project_id
            send_status        : $send_status
            send_message       : $send_message
            association_status : $association_status
            association_message: $association_message
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