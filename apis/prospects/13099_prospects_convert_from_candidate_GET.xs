query "prospects/convert_from_candidate" verb=GET {
  auth = "user"

  input {
    int candidate_id? filters=min:1
  }

  stack {
    // Candidate lookup and validation
    group {
      stack {
        db.get parsed_candidate {
          field_name = "id"
          field_value = $input.candidate_id
        } as $candidate
      
        precondition ($candidate != null) {
          error_type = "notfound"
          error = "Candidate not found"
        }
      
        // Step 2: Initial validations
        // Require non-empty ES id on prospect     
        precondition ($candidate.elastic_search_document_id != "") {
          error_type = "badrequest"
          error = "Candidate is missing elastic_search_document_id"
        }
      
        // DB uniqueness check across key identifiers
        db.query parsed_prospect {
          where = (($db.parsed_prospect.linkedin_profile == $candidate.linkedin_profile && $candidate.linkedin_profile != "") || ($db.parsed_prospect.linked_recruit_profile_id == $candidate.linked_recruit_profile_id && $candidate.linked_recruit_profile_id != "") || ($db.parsed_prospect.email == $candidate.email && $candidate.email != ""))
          return = {type: "single"}
          output = ["id"]
        } as $existing_prospect
      
        precondition ($existing_prospect == null) {
          error_type = "badrequest"
          error = "Existing prospect found for provided identifiers"
        }
      
        cloud.elasticsearch.document {
          auth_type = "API Key"
          key_id = $env.es_key_id
          access_key = $env.es_access_key
          region = ""
          method = "GET"
          index = "prospects"
          doc_id = $candidate.elastic_search_document_id
          doc = {}
        } as $es_prospect_doc
      
        conditional {
          if ($es_prospect_doc != null && $es_prospect_doc != 404) {
            precondition ($es_prospect_doc._source == null) {
              error_type = "badrequest"
              error = "Existing prospect ES document uses this elastic_search_document_id"
            }
          }
        }
      }
    }
  
    // Construct prospect payload
    group {
      stack {
        var $candidate_for_mapping {
          value = $candidate
        }
      
        api.lambda {
          code = """
              const candidate = $var.candidate_for_mapping;
              if (!candidate || typeof candidate !== 'object') {
                return {};
              }
            
              const prospectFieldSet = new Set([
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
                "manatal_id",
                "picture",
                "openai_file_id",
                "elastic_search_document_id",
                "normalized_date",
                "es_created_updated_date",
                "linked_recruit_profile_id",
                "old_system_notes",
                "general_notes",
                "linked_html"
              ]);
            
              const payload = {};
            
              for (const field of prospectFieldSet) {
                if (!(field in candidate)) {
                  continue;
                }
            
                const rawValue = candidate[field];
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
            
              if (candidate.elastic_search_document_id) {
                const docId = String(candidate.elastic_search_document_id).trim();
                if (docId.length > 0) {
                  payload.elastic_search_document_id = docId;
                }
              }
            
              if (candidate.openai_file_id) {
                const fileId = String(candidate.openai_file_id).trim();
                if (fileId.length > 0) {
                  payload.openai_file_id = fileId;
                }
              }
            
              return payload;
            """
          timeout = 10
        } as $prospect_payload
      
        object.keys {
          value = $prospect_payload
        } as $prospect_payload_fields
      
        precondition ($prospect_payload_fields != null && $prospect_payload_fields.count > 0) {
          error_type = "badrequest"
          error = "Unable to construct prospect payload from candidate"
        }
      
        var $prospect_es_doc {
          value = $prospect_payload
        }
      }
    }
  
    // Persist prospect record
    group {
      stack {
        db.add parsed_prospect {
          data = {
            created_at                : now
            public_name               : $prospect_payload|get:"public_name"
            first_name                : $prospect_payload|get:"first_name"
            last_name                 : $prospect_payload|get:"last_name"
            city                      : $prospect_payload|get:"city"
            country                   : $prospect_payload|get:"country"
            languages                 : $prospect_payload|get:"languages"
            total_experience_years    : $prospect_payload|get:"total_experience_years"
            short_role                : $prospect_payload|get:"short_role"
            headline_role             : $prospect_payload|get:"headline_role"
            role_summary              : $prospect_payload|get:"role_summary"
            technical_summary         : $prospect_payload|get:"technical_summary"
            salary_aspiration         : $prospect_payload|get:"salary_aspiration"
            employment_status         : $prospect_payload|get:"employment_status"
            skills                    : $prospect_payload|get:"skills"
            work_history              : $prospect_payload|get:"work_history"
            education                 : $prospect_payload|get:"education"
            certifications            : $prospect_payload|get:"certifications"
            email                     : $prospect_payload|get:"email"
            phone_number              : $prospect_payload|get:"phone_number"
            linkedin_profile          : $prospect_payload|get:"linkedin_profile"
            github_profile            : $prospect_payload|get:"github_profile"
            availability              : $prospect_payload|get:"availability"
            resume_last_modified      : $prospect_payload|get:"resume_last_modified"
            profile_last_updated      : $prospect_payload|get:"profile_last_updated"
            industries                : $prospect_payload|get:"industries"
            manatal_id                : $prospect_payload|get:"manatal_id"
            picture                   : $prospect_payload|get:"picture"
            openai_file_id            : $prospect_payload|get:"openai_file_id"
            elastic_search_document_id: $prospect_payload|get:"elastic_search_document_id"
            normalized_date           : $prospect_payload|get:"normalized_date"
            es_created_updated_date   : $prospect_payload|get:"es_created_updated_date"
            linked_recruit_profile_id : $prospect_payload|get:"linked_recruit_profile_id"
            old_system_notes          : $prospect_payload|get:"old_system_notes"
            general_notes             : $prospect_payload|get:"general_notes"
            linked_html               : $prospect_payload|get:"linked_html"
          }
        } as $prospect
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
          index = "prospects"
          doc_id = $prospect.elastic_search_document_id
          doc = $prospect_es_doc
        } as $prospect_es_upsert
      }
    }
  
    // Cleanup candidate records
    group {
      stack {
        cloud.elasticsearch.document {
          auth_type = "API Key"
          key_id = $env.es_key_id
          access_key = $env.es_access_key
          region = ""
          method = "DELETE"
          index = "candidates"
          doc_id = $candidate.elastic_search_document_id
          doc = {}
        } as $candidate_es_delete
      
        db.del parsed_candidate {
          field_name = "id"
          field_value = $candidate.id
        }
      }
    }
  
    // Rewire related records
    group {
      stack {
        db.transaction {
          stack {
            db.query project_person_association {
              where = $db.project_person_association.person_id == $candidate.id && $db.project_person_association.person_type == "candidate"
              return = {type: "list"}
            } as $candidate_associations
          
            conditional {
              if ($candidate_associations != null && $candidate_associations.count > 0) {
                var.update $association_status {
                  value = "success"
                }
              
                foreach ($candidate_associations) {
                  each as $association_entry {
                    db.query project_person_association {
                      where = $db.project_person_association.project_id == $association_entry.project_id && $db.project_person_association.person_id == $prospect.id && $db.project_person_association.person_type == "prospect"
                      return = {type: "single"}
                      output = ["id"]
                    } as $existing_prospect_association
                  
                    conditional {
                      if ($existing_prospect_association != null) {
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
                        person_id  : $prospect.id
                        person_type: "prospect"
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
                            notes                        : "Converted to prospect"
                            activity_type                : "convert_to_prospect"
                            stage_id                     : $association_entry.current_stage_id
                            user_id                      : $auth.id
                          }
                        } as $conversion_stage_log
                      }
                    }
                  }
                }
              }
            }
          
            db.query person_activity_history {
              where = $db.person_activity_history.person_id == $candidate.id && $db.person_activity_history.person_type == "candidate"
              return = {type: "list"}
            } as $candidate_activity_history
          
            conditional {
              if ($candidate_activity_history != null && $candidate_activity_history.count > 0) {
                var.update $history_status {
                  value = "success"
                }
              
                foreach ($candidate_activity_history) {
                  each as $history_entry {
                    db.edit person_activity_history {
                      field_name = "id"
                      field_value = $history_entry.id
                      data = {
                        id         : null
                        person_id  : $prospect.id
                        person_type: "prospect"
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
              where = $db.person_attachment.person_id == $candidate.id && $db.person_attachment.person_type == "candidate"
              return = {type: "list"}
            } as $candidate_attachments
          
            conditional {
              if ($candidate_attachments != null && $candidate_attachments.count > 0) {
                var.update $attachment_status {
                  value = "success"
                }
              
                foreach ($candidate_attachments) {
                  each as $attachment_entry {
                    db.edit person_attachment {
                      field_name = "id"
                      field_value = $attachment_entry.id
                      data = {
                        id         : null
                        person_id  : $prospect.id
                        person_type: "prospect"
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
    prospect_id       : $prospect.id
    candidate_id      : $candidate.id
    association_status: $association_status
    history_status    : $history_status
    attachment_status : $attachment_status
  }
}