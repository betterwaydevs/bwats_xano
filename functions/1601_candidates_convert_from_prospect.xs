function candidates_convert_from_prospect {
  input {
    int prospect_id? filters=min:1
  }

  stack {
    // Prospect lookup and validation
    group {
      stack {
        db.get parsed_prospect {
          field_name = "id"
          field_value = $input.prospect_id
        } as $prospect
      
        precondition ($prospect != null) {
          error_type = "notfound"
          error = "Prospect not found"
        }
      
        // Step 2: Initial validations
        // Require non-empty ES id on prospect
        precondition ($prospect.elastic_search_document_id != "") {
          error_type = "badrequest"
          error = "Prospect is missing elastic_search_document_id"
        }
      
        // DB uniqueness check across key identifiers
        db.query parsed_candidate {
          where = (($db.parsed_candidate.linkedin_profile == $prospect.linkedin_profile && $prospect.linkedin_profile != "") || ($db.parsed_candidate.linked_recruit_profile_id == $prospect.linked_recruit_profile_id && $prospect.linked_recruit_profile_id != "") || ($db.parsed_candidate.email == $prospect.email && $prospect.email != ""))
          return = {type: "single"}
          output = ["id"]
        } as $existing_candidate
      
        precondition ($existing_candidate == null) {
          error_type = "badrequest"
          error = "Existing candidate found for provided identifiers"
        }
      
        // ES collision: verify no candidate document exists with same ES id
        cloud.elasticsearch.document {
          auth_type = "API Key"
          key_id = $env.es_key_id
          access_key = $env.es_access_key
          region = ""
          method = "GET"
          index = "candidates"
          doc_id = $prospect.elastic_search_document_id
          doc = {}
        } as $es_candidate_doc
      
        // If ES document exists in candidates with same id, block conversion
        conditional {
          if ($es_candidate_doc != null && $es_candidate_doc != 404) {
            precondition ($es_candidate_doc._source == null) {
              error_type = "badrequest"
              error = "Existing candidate ES document uses this elastic_search_document_id"
            }
          }
        }
      }
    }
  
    // Construct candidate payload
    group {
      stack {
        var $prospect_for_mapping {
          value = $prospect
        }
      
        api.lambda {
          code = """
              const prospect = $var.prospect_for_mapping;
              if (!prospect || typeof prospect !== 'object') {
                return {};
              }
            
              const candidateFieldSet = new Set([
                "public_name",
                "first_name",
                "last_name",
                "city",
                "country",
                "languages",
                "total_experience_years",
                "short_role",
                "headline_role",
                "role_summary",
                "technical_summary",
                "salary_aspiration",
                "employment_status",
                "skills",
                "work_history",
                "education",
                "certifications",
                "email",
                "phone_number",
                "linkedin_profile",
                "github_profile",
                "availability",
                "resume_last_modified",
                "profile_last_updated",
                "industries",
                "picture",
                "openai_file_id",
                "elastic_search_document_id",
                "normalized_date",
                "es_created_updated_date",
                "linked_recruit_profile_id",
                "general_notes",
                "linked_html"
              ]);
            
              const payload = {};
            
              for (const field of candidateFieldSet) {
                if (!(field in prospect)) {
                  continue;
                }
            
                const rawValue = prospect[field];
                if (rawValue === null || rawValue === undefined) {
                  continue;
                }
            
                if (typeof rawValue === 'string') {
                  const trimmed = rawValue.trim();
                  if (trimmed.length === 0) {
                    continue;
                  }
                  payload[field] = trimmed;
                  continue;
                }
            
                if (Array.isArray(rawValue)) {
                  if (rawValue.length === 0) {
                    continue;
                  }
                  payload[field] = rawValue;
                  continue;
                }
            
                if (typeof rawValue === 'object') {
                  if (Object.keys(rawValue).length === 0) {
                    continue;
                  }
                  payload[field] = rawValue;
                  continue;
                }
            
                payload[field] = rawValue;
              }
            
              if (payload.email && typeof payload.email === 'string') {
                const lowered = payload.email.trim().toLowerCase();
                if (lowered.length > 0) {
                  payload.email = lowered;
                } else {
                  delete payload.email;
                }
              }
            
              if (prospect.elastic_search_document_id) {
                const docId = String(prospect.elastic_search_document_id).trim();
                if (docId.length > 0) {
                  payload.elastic_search_document_id = docId;
                }
              }
            
              if (prospect.openai_file_id) {
                const fileId = String(prospect.openai_file_id).trim();
                if (fileId.length > 0) {
                  payload.openai_file_id = fileId;
                }
              }
            
              return payload;
            """
          timeout = 10
        } as $candidate_payload
      
        object.keys {
          value = $candidate_payload
        } as $candidate_payload_fields
      
        precondition ($candidate_payload_fields != null && $candidate_payload_fields.count > 0) {
          error_type = "badrequest"
          error = "Unable to construct candidate payload from prospect"
        }
      
        var $candidate_es_doc {
          value = $candidate_payload
        }
      }
    }
  
    // Persist candidate record
    group {
      stack {
        db.add parsed_candidate {
          data = {
            created_at                : now
            public_name               : $candidate_payload|get:"public_name"
            first_name                : $candidate_payload|get:"first_name"
            last_name                 : $candidate_payload|get:"last_name"
            city                      : $candidate_payload|get:"city"
            country                   : $candidate_payload|get:"country"
            languages                 : $candidate_payload|get:"languages"
            total_experience_years    : $candidate_payload|get:"total_experience_years"
            short_role                : $candidate_payload|get:"short_role"
            headline_role             : $candidate_payload|get:"headline_role"
            role_summary              : $candidate_payload|get:"role_summary"
            technical_summary         : $candidate_payload|get:"technical_summary"
            salary_aspiration         : $candidate_payload|get:"salary_aspiration"
            employment_status         : $candidate_payload|get:"employment_status"
            skills                    : $candidate_payload|get:"skills"
            work_history              : $candidate_payload|get:"work_history"
            education                 : $candidate_payload|get:"education"
            certifications            : $candidate_payload|get:"certifications"
            email                     : $candidate_payload|get:"email"
            phone_number              : $candidate_payload|get:"phone_number"
            linkedin_profile          : $candidate_payload|get:"linkedin_profile"
            github_profile            : $candidate_payload|get:"github_profile"
            availability              : $candidate_payload|get:"availability"
            resume_last_modified      : $candidate_payload|get:"resume_last_modified"
            profile_last_updated      : $candidate_payload|get:"profile_last_updated"
            industries                : $candidate_payload|get:"industries"
            manatal_id                : $candidate_payload|get:"manatal_id"
            picture                   : $candidate_payload|get:"picture"
            openai_file_id            : $candidate_payload|get:"openai_file_id"
            elastic_search_document_id: $candidate_payload|get:"elastic_search_document_id"
            normalized_date           : $candidate_payload|get:"normalized_date"
            es_created_updated_date   : $candidate_payload|get:"es_created_updated_date"
            linked_recruit_profile_id : $candidate_payload|get:"linked_recruit_profile_id"
            old_system_notes          : $candidate_payload|get:"old_system_notes"
            general_notes             : $candidate_payload|get:"general_notes"
            linked_html               : $candidate_payload|get:"linked_html"
          }
        } as $candidate
      }
    }
  
    // Initialize conversion status flags
    group {
      stack {
        var $association_status {
          value = "skipped"
        }
      
        var $history_status {
          value = "skipped"
        }
      
        var $attachment_status {
          value = "skipped"
        }
      
        var $conversion_success {
          value = true
        }
      }
    }
  
    // Synchronize Elasticsearch
    group {
      stack {
        cloud.elasticsearch.document {
          auth_type = "API Key"
          key_id = $env.es_key_id
          access_key = $env.es_access_key
          region = ""
          method = "PUT"
          index = "candidates"
          doc_id = $candidate.elastic_search_document_id
          doc = $candidate_es_doc
        } as $candidate_es_upsert
      }
    }
  
    // Cleanup prospect records
    group {
      stack {
        cloud.elasticsearch.document {
          auth_type = "API Key"
          key_id = $env.es_key_id
          access_key = $env.es_access_key
          region = ""
          method = "DELETE"
          index = "prospects"
          doc_id = $prospect.elastic_search_document_id
          doc = {}
        } as $prospect_es_delete
      
        db.del parsed_prospect {
          field_name = "id"
          field_value = $prospect.id
        }
      }
    }
  
    // Rewire related records
    group {
      stack {
        db.transaction {
          stack {
            db.query project_person_association {
              where = $db.project_person_association.person_id == $prospect.id && $db.project_person_association.person_type == "prospect"
              return = {type: "list"}
            } as $prospect_associations
          
            conditional {
              if ($prospect_associations != null && $prospect_associations.count > 0) {
                var.update $association_status {
                  value = "success"
                }
              
                foreach ($prospect_associations) {
                  each as $association_entry {
                    db.query project_person_association {
                      where = $db.project_person_association.project_id == $association_entry.project_id && $db.project_person_association.person_id == $candidate.id && $db.project_person_association.person_type == "candidate"
                      return = {type: "single"}
                      output = ["id"]
                    } as $existing_candidate_association
                  
                    conditional {
                      if ($existing_candidate_association != null) {
                        var.update $association_status {
                          value = "conflict"
                        }
                      
                        var.update $conversion_success {
                          value = false
                        }
                      
                        continue
                      }
                    }
                  
                    db.edit project_person_association {
                      field_name = "id"
                      field_value = $association_entry.id
                      data = {
                        id         : null
                        person_id  : $candidate.id
                        person_type: "candidate"
                      }
                    } as $updated_association
                  
                    conditional {
                      if ($updated_association == null) {
                        var.update $association_status {
                          value = "failed"
                        }
                      
                        var.update $conversion_success {
                          value = false
                        }
                      }
                    }
                  
                    conditional {
                      if ($updated_association != null) {
                        function.run association_project_change_stage {
                          input = {
                            project_person_association_id: $association_entry.id
                            notes                        : "Converted to candidate"
                            activity_type                : "convert_to_candidate"
                            stage_id                     : $association_entry.current_stage_id
                            user_id                      : 0
                          }
                        } as $conversion_stage_log
                      }
                    }
                  }
                }
              }
            }
          
            db.query person_activity_history {
              where = $db.person_activity_history.person_id == $prospect.id && $db.person_activity_history.person_type == "prospect"
              return = {type: "list"}
            } as $prospect_activity_history
          
            conditional {
              if ($prospect_activity_history != null && $prospect_activity_history.count > 0) {
                var.update $history_status {
                  value = "success"
                }
              
                foreach ($prospect_activity_history) {
                  each as $history_entry {
                    db.edit person_activity_history {
                      field_name = "id"
                      field_value = $history_entry.id
                      data = {
                        id         : null
                        person_id  : $candidate.id
                        person_type: "candidate"
                      }
                    } as $updated_history
                  
                    conditional {
                      if ($updated_history == null) {
                        var.update $history_status {
                          value = "failed"
                        }
                      
                        var.update $conversion_success {
                          value = false
                        }
                      }
                    }
                  }
                }
              }
            }
          
            db.query person_attachment {
              where = $db.person_attachment.person_id == $prospect.id && $db.person_attachment.person_type == "prospect"
              return = {type: "list"}
            } as $prospect_attachments
          
            conditional {
              if ($prospect_attachments != null && $prospect_attachments.count > 0) {
                var.update $attachment_status {
                  value = "success"
                }
              
                foreach ($prospect_attachments) {
                  each as $attachment_entry {
                    db.edit person_attachment {
                      field_name = "id"
                      field_value = $attachment_entry.id
                      data = {
                        id         : null
                        person_id  : $candidate.id
                        person_type: "candidate"
                      }
                    } as $updated_attachment
                  
                    conditional {
                      if ($updated_attachment == null) {
                        var.update $attachment_status {
                          value = "failed"
                        }
                      
                        var.update $conversion_success {
                          value = false
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
  }

  response = {
    success           : $conversion_success
    candidate_id      : $candidate.id
    prospect_id       : $prospect.id
    association_status: $association_status
    history_status    : $history_status
    attachment_status : $attachment_status
  }
}