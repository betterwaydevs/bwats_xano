query "candidate/quick_apply" verb=POST {
  input {
    text linkedin_profile filters=trim
    int project_id filters=min:1
    text first_name filters=trim
    text last_name filters=trim
    text email? filters=trim|lower
    text phone_number? filters=trim
    bool opt_in_matching_jobs?
    bool opt_in_marketing_general?
    bool debug?
  }

  stack {
    var $user {
      value = "{\r\n    \"id\": 0,\r\n    \"name\":\"guest\"\r\n}"
    }
  
    !var.update $user {
      value = ""|set:$user:"guest"
    }
  
    !debug.stop {
      value = $user.id
    }
  
    // Section A – Input preparation
    group {
      stack {
        precondition ($input.linkedin_profile != null && $input.linkedin_profile != "") {
          error_type = "inputerror"
          error = "Missing param: linkedin_profile"
        }
      
        precondition ($input.first_name != null && $input.first_name != "") {
          error_type = "inputerror"
          error = "Missing param: first_name"
        }
      
        precondition ($input.last_name != null && $input.last_name != "") {
          error_type = "inputerror"
          error = "Missing param: last_name"
        }
      
        api.lambda {
          code = """
              const rawUrl = ($input.linkedin_profile || '').trim();
              if (!rawUrl) {
                return { error: 'LinkedIn profile is required' };
              }
            
              const withoutFragment = rawUrl.split('#')[0];
              const withoutQuery = withoutFragment.split('?')[0];
              const normalized = withoutQuery.replace(/\/+$/, '');
            
              const pattern = /^https:\/\/(www\.)?linkedin\.com\/in\//i;
              if (!pattern.test(normalized)) {
                return { error: 'LinkedIn profile must match https://www.linkedin.com/in/{slug}' };
              }
            
              const slug = normalized.replace(pattern, '').trim();
              if (!slug || slug.includes('/')) {
                return { error: 'LinkedIn profile slug is invalid' };
              }
            
              return {
                error: null,
                normalized_url: normalized,
                slug: slug.toLowerCase()
              };
            """
          timeout = 10
        } as $linkedin_validation
      
        precondition ($linkedin_validation.error == null) {
          error_type = "inputerror"
          error = $linkedin_validation.error
        }
      
        var $normalized_linkedin_profile {
          value = $linkedin_validation.normalized_url
        }
      
        var $linkedin_slug {
          value = $linkedin_validation.slug
        }
      
        var $request_ip_address {
          value = ($request.ip != null ? $request.ip : null)
        }
      
        var $opt_in_matching_jobs_flag {
          value = ($input.opt_in_matching_jobs == true)
        }
      
        var $opt_in_marketing_general_flag {
          value = ($input.opt_in_marketing_general == true)
        }
      }
    }
  
    var $candidate {
      value = null
    }
  
    var $x1 {
      value = ""
    }
  
    var $target_stage_id {
      value = null
    }
  
    var $quick_apply_applicant_snapshot {
      value = {
        project_id      : $input.project_id
        first_name      : $input.first_name
        last_name       : $input.last_name
        email           : $input.email
        phone_number    : $input.phone_number
        linkedin_profile: $normalized_linkedin_profile
      }
    }
  
    var $application_notification_id {
      value = null
    }
  
    var $application_public_id {
      value = null
    }
  
    group {
      stack {
        var $applicant_name {
          value = ($input.first_name ~ " " ~ $input.last_name)|trim
        }
      
        api.lambda {
          code = """
              const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
              let result = '';
              for (let i = 0; i < 6; i += 1) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              return { code: result };
            """
          timeout = 5
        } as $application_code_lambda
      
        var.update $application_public_id {
          value = $application_code_lambda.code
        }
      
        db.add application_notification {
          data = {
            created_at     : "now"
            applicant_name : $applicant_name
            applicant_email: $input.email
            applicant_phone: $input.phone_number
            project_id     : $input.project_id
            linked_url     : $normalized_linkedin_profile
            status         : "pending"
            application_id : $application_public_id
          }
        } as $application_notification
      
        var.update $application_notification_id {
          value = $application_notification.id
        }
      }
    }
  
    var $candidate_elastic_search_document_id {
      value = null
    }
  
    var $candidate_resolution_source {
      value = "unknown"
    }
  
    var $candidate_contact_updated {
      value = false
    }
  
    var $association {
      value = null
    }
  
    var $association_created {
      value = false
    }
  
    var $stage_history_id {
      value = null
    }
  
    try_catch {
      try {
        // Section B – Pre-flight validation
        group {
          stack {
            db.get project {
              field_name = "id"
              field_value = $input.project_id
            } as $project
          
            precondition ($project != null) {
              error_type = "notfound"
              error = "Project not found"
            }
          
            var.update $target_stage_id {
              value = $project.self_application_candidate_stage_id
            }
          
            precondition ($target_stage_id != null) {
              error_type = "badrequest"
              error = "Project missing self-application stage"
            }
          
            db.get stage {
              field_name = "id"
              field_value = $target_stage_id
            } as $stage
          
            precondition ($stage != null) {
              error_type = "notfound"
              error = "Stage not found"
            }
          
            precondition ($stage.project_id == $project.id) {
              error_type = "badrequest"
              error = "Stage does not belong to supplied project"
            }
          
            db.query parsed_candidate {
              where = $db.parsed_candidate.linkedin_profile == $normalized_linkedin_profile
              return = {type: "single"}
              output = ["id", "elastic_search_document_id", "linkedin_profile"]
            } as $existing_candidate
          
            db.query parsed_prospect {
              where = $db.parsed_prospect.linkedin_profile == $normalized_linkedin_profile
              return = {type: "single"}
              output = ["id", "elastic_search_document_id", "linkedin_profile"]
            } as $existing_prospect
          }
        }
      
        // Section C – Candidate Resolution
        group {
          stack {
            conditional {
              if ($existing_candidate != null) {
                var.update $candidate {
                  value = $existing_candidate
                }
              
                var.update $candidate_elastic_search_document_id {
                  value = $existing_candidate.elastic_search_document_id
                }
              
                var.update $candidate_resolution_source {
                  value = "existing_candidate"
                }
              }
            }
          
            conditional {
              if ($candidate == null && $existing_prospect != null) {
                function.run candidates_convert_from_prospect {
                  input = {prospect_id: $existing_prospect.id}
                } as $prospect_conversion
              
                precondition (!($prospect_conversion == null || $prospect_conversion.success != true)) {
                  error_type = "badrequest"
                  error = "Failed to convert prospect to candidate"
                }
              
                db.get parsed_candidate {
                  field_name = "id"
                  field_value = $prospect_conversion.candidate_id
                } as $converted_candidate
              
                precondition ($converted_candidate != null) {
                  error_type = "notfound"
                  error = "Converted candidate not found"
                }
              
                var.update $candidate {
                  value = $converted_candidate
                }
              
                var.update $candidate_elastic_search_document_id {
                  value = $converted_candidate.elastic_search_document_id
                }
              
                var.update $candidate_resolution_source {
                  value = "converted_prospect"
                }
              }
            }
          
            conditional {
              if ($candidate == null) {
                var $candidate_es_doc {
                  value = {}
                    |set:"first_name":$input.first_name
                    |set:"last_name":$input.last_name
                    |set:"linkedin_profile":$normalized_linkedin_profile
                    |set:"linkedin_slug":$linkedin_slug
                }
              
                object.keys {
                  value = $candidate_es_doc
                } as $candidate_es_doc_fields
              
                precondition ($candidate_es_doc_fields != null && $candidate_es_doc_fields.count > 0) {
                  error_type = "badrequest"
                  error = "Unable to build Elasticsearch payload for candidate"
                }
              
                function.run "elastic_search/document" {
                  input = {
                    index : "candidates"
                    method: "POST"
                    doc   : $candidate_es_doc
                  }
                } as $candidate_es_create
              
                precondition ($candidate_es_create != null && $candidate_es_create != 404) {
                  error_type = "badrequest"
                  error = "Failed to create candidate in Elasticsearch"
                }
              
                var.update $candidate_elastic_search_document_id {
                  value = $candidate_es_create|get:"_id"
                }
              
                precondition ($candidate_elastic_search_document_id != null && $candidate_elastic_search_document_id != "") {
                  error_type = "badrequest"
                  error = "ElasticSearch response missing document id"
                }
              
                db.add parsed_candidate {
                  data = {
                    created_at                : now
                    first_name                : $input.first_name
                    last_name                 : $input.last_name
                    email                     : $input.email
                    phone_number              : $input.phone_number
                    linkedin_profile          : $normalized_linkedin_profile
                    elastic_search_document_id: $candidate_elastic_search_document_id
                  }
                } as $new_candidate
              
                var.update $candidate {
                  value = $new_candidate
                }
              
                var.update $candidate_resolution_source {
                  value = "new_candidate"
                }
              }
            }
          
            precondition ($candidate != null) {
              error_type = "badrequest"
              error = "Unable to resolve candidate"
            }
          
            precondition ($candidate_elastic_search_document_id != null && $candidate_elastic_search_document_id != "") {
              error_type = "badrequest"
              error = "Candidate missing elasticsearch id"
            }
          
            conditional {
              if ($application_notification_id != null) {
                db.edit application_notification {
                  field_name = "id"
                  field_value = $application_notification_id
                  data = {candidate_id: $candidate.id}
                } as $application_notification_update
              }
            }
          }
        }
      
        // Section D – Candidate Contact Enrichment
        group {
          stack {
            db.get parsed_candidate {
              field_name = "id"
              field_value = $candidate.id
            } as $candidate_record
          
            conditional {
              if (($candidate_record.email == null || $candidate_record.email == "") && ($input.email != null && $input.email != "")) {
                db.edit parsed_candidate {
                  field_name = "id"
                  field_value = $candidate.id
                  data = {email: $input.email}
                } as $candidate_email_update
              
                var.update $candidate_contact_updated {
                  value = true
                }
              }
            }
          
            conditional {
              if (($candidate_record.phone_number == null || $candidate_record.phone_number == "") && ($input.phone_number != null && $input.phone_number != "")) {
                db.edit parsed_candidate {
                  field_name = "id"
                  field_value = $candidate.id
                  data = {phone_number: $input.phone_number}
                } as $candidate_phone_update
              
                var.update $candidate_contact_updated {
                  value = true
                }
              }
            }
          
            conditional {
              if ($candidate_contact_updated && $candidate_elastic_search_document_id != null && $candidate_elastic_search_document_id != "") {
                var $candidate_es_contact_patch {
                  value = {}
                }
              
                conditional {
                  if ($input.email != null && $input.email != "") {
                    var.update $candidate_es_contact_patch {
                      value = $candidate_es_contact_patch|set:"email":$input.email
                    }
                  }
                }
              
                conditional {
                  if ($input.phone_number != null && $input.phone_number != "") {
                    var.update $candidate_es_contact_patch {
                      value = $candidate_es_contact_patch
                        |set:"phone_number":$input.phone_number
                    }
                  }
                }
              
                function.run "elastic_search/document" {
                  input = {
                    index : "candidates"
                    method: "POST"
                    doc_id: $candidate_elastic_search_document_id
                    doc   : $candidate_es_contact_patch
                  }
                }
              }
            }
          }
        }
      
        // Section E – Consent capture
        group {
          stack {
            conditional {
              if ($opt_in_matching_jobs_flag || $opt_in_marketing_general_flag) {
                var $consent_epoch_ms {
                  value = "now"|to_ms
                }
              
                function.run candidate_contact_permission {
                  input = {
                    candidate_id               : $candidate.id
                    opt_in_matching_jobs       : $opt_in_matching_jobs_flag
                    opt_in_matching_jobs_ip    : $request_ip_address
                    opt_in_matching_jobs_at    : ($opt_in_matching_jobs_flag == true ? $consent_epoch_ms : null)
                    opt_in_marketing_general   : $opt_in_marketing_general_flag
                    opt_in_marketing_general_ip: $request_ip_address
                    opt_in_marketing_general_at: ($opt_in_marketing_general_flag == true ? $consent_epoch_ms : null)
                  }
                } as $candidate_contact_permission_record
              }
            }
          }
        }
      
        // Section D – Association & Stage History
        group {
          stack {
            db.query project_person_association {
              where = $db.project_person_association.project_id == $input.project_id && $db.project_person_association.person_id == $candidate.id && $db.project_person_association.person_type == "candidate"
              return = {type: "single"}
            } as $existing_association
          
            conditional {
              if ($existing_association != null) {
                var.update $association {
                  value = $existing_association
                }
              
                conditional {
                  if ($existing_association.current_stage_id != $target_stage_id) {
                    db.edit project_person_association {
                      field_name = "id"
                      field_value = $existing_association.id
                      data = {current_stage_id: $target_stage_id, updated_at: now}
                    }
                  
                    var.update $association {
                      value = $existing_association
                        |set:"current_stage_id":$target_stage_id
                    }
                  }
                }
              }
            }
          
            conditional {
              if ($association == null) {
                db.add project_person_association {
                  data = {
                    created_at       : "now"
                    project_id       : $input.project_id
                    person_id        : $candidate.id
                    person_type      : "candidate"
                    current_stage_id : $target_stage_id
                    updated_at       : now
                    added_by_user_id : 0
                    elastic_search_id: $candidate_elastic_search_document_id
                  }
                } as $new_association
              
                var.update $association {
                  value = $new_association
                }
              
                var.update $association_created {
                  value = true
                }
              }
            }
          
            precondition ($association != null) {
              error_type = "badrequest"
              error = "Failed to resolve project association"
            }
          
            function.run association_project_change_stage {
              input = {
                project_person_association_id: $association.id
                activity_type                : "applied"
                stage_id                     : $target_stage_id
                user_id                      : 0
                notes                        : "Candidate applied via Quick Apply"
              }
            } as $stage_history
          }
        }
      }
    
      catch {
        debug.log {
          value = {context: "candidate/quick_apply downstream failure"}
        }
      }
    }
  
    var $debug_info {
      value = {
        candidate_resolution_source: $candidate_resolution_source
        candidate_id               : ($candidate ? $candidate.id : null)
        candidate_es_id            : $candidate_elastic_search_document_id
        association_created        : $association_created
        association_id             : ($association ? $association.id : null)
        stage_history_id           : $stage_history_id
        contact_updated            : $candidate_contact_updated
        project_id                 : $input.project_id
        target_stage_id            : $target_stage_id
        notification_id            : $application_notification_id
      }
    }
  }

  response = {
    success       : true
    application_id: $application_public_id
    debug         : ($input.debug ? $debug_info : null)
  }

  test "should require linkedin profile" {
    input = {
      linkedin_profile: ""
      project_id      : 1
      stage_id        : 1
      first_name      : ""
      last_name       : ""
      email           : ""
    }
  
    expect.to_throw {
      exception = "Missing param: linkedin_profile"
    }
  }

  test "should reject invalid linkedin url format" {
    input = {
      linkedin_profile: "https://www.linkedin.com/in/badslug/"
      project_id      : 1
      stage_id        : 1
      first_name      : "jane"
      last_name       : "doe"
      email           : "jane.doe@example.com"
    }
  
    expect.to_throw {
      exception = "ERROR_CODE_NOT_FOUND"
    }
  }
}