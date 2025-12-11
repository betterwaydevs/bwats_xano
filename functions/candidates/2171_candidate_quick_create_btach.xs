function "candidates/candidate_quick_create_btach" {
  input {
    int project_id filters=min:1
    int stage_id filters=min:1
    json candidates
  }

  stack {
    var $candidates_input {
      value = ($input.candidates != null ? ($input.candidates|json_decode) : [])
    }

    var $total_candidates {
      value = ($candidates_input != null ? ($candidates_input|count) : 0)
    }

    var $results {
      value = []
    }

    var $summary {
      value = {
        total_processed: $total_candidates
        created_count  : 0
        assigned_count : 0
        failed_count   : 0
      }
    }

    var $effective_added_by_user_id {
      value = $auth.id
    }

    db.get project {
      field_name = "id"
      field_value = $input.project_id
    } as $project

    precondition ($project != null) {
      error_type = "notfound"
      error = "Project not found"
    }

    db.get stage {
      field_name = "id"
      field_value = $input.stage_id
    } as $stage

    precondition ($stage != null) {
      error_type = "notfound"
      error = "Stage not found"
    }

    precondition ($stage.project_id == $project.id) {
      error_type = "badrequest"
      error = "Stage does not belong to supplied project"
    }

    foreach ($candidates_input) {
      each as $candidate_item {
        var $candidate_display_profile {
          value = ($candidate_item.linkedin_profile != null ? $candidate_item.linkedin_profile : "")
        }

        var $raw_linkedin_profile {
          value = ($candidate_display_profile != "" ? ($candidate_display_profile|trim) : "")
        }

        conditional {
          if ($raw_linkedin_profile == "") {
            var.update $summary {
              value = $summary
                |set:"failed_count":($summary.failed_count + 1)
            }
          
            var.update $results {
              value = $results
                |push:```
                  {
                    status          : "failed"
                    linkedin_profile: $candidate_display_profile
                    error           : "Missing param: linkedin_profile"
                  }
                  ```
            }
          
            continue
          }
        }

        var $candidate_first_name {
          value = ($candidate_item.first_name != null ? ($candidate_item.first_name|trim) : "")
        }

        conditional {
          if ($candidate_first_name == "") {
            var.update $summary {
              value = $summary
                |set:"failed_count":($summary.failed_count + 1)
            }
          
            var.update $results {
              value = $results
                |push:```
                  {
                    status          : "failed"
                    linkedin_profile: $candidate_display_profile
                    error           : "Missing param: first_name"
                  }
                  ```
            }
          
            continue
          }
        }

        var $candidate_last_name {
          value = ($candidate_item.last_name != null ? ($candidate_item.last_name|trim) : "")
        }

        conditional {
          if ($candidate_last_name == "") {
            var.update $summary {
              value = $summary
                |set:"failed_count":($summary.failed_count + 1)
            }
          
            var.update $results {
              value = $results
                |push:```
                  {
                    status          : "failed"
                    linkedin_profile: $candidate_display_profile
                    error           : "Missing param: last_name"
                  }
                  ```
            }
          
            continue
          }
        }

        var $candidate_email {
          value = ($candidate_item.email != null ? ($candidate_item.email|trim) : "")
        }

        var $linkedin_payload {
          value = $raw_linkedin_profile
        }

        api.lambda {
          code = """
              const rawUrl = ($var.linkedin_payload || '').trim();
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

        conditional {
          if ($linkedin_validation.error != null) {
            var.update $summary {
              value = $summary
                |set:"failed_count":($summary.failed_count + 1)
            }
          
            var.update $results {
              value = $results
                |push:```
                  {
                    status          : "failed"
                    linkedin_profile: $candidate_display_profile
                    error           : $linkedin_validation.error
                  }
                  ```
            }
          
            continue
          }
        }

        var $normalized_linkedin_profile {
          value = $linkedin_validation.normalized_url
        }

        var $linkedin_slug {
          value = $linkedin_validation.slug
        }

        try_catch {
          try {

            db.query parsed_candidate {
              where = $db.parsed_candidate.linkedin_profile includes $linkedin_slug || $db.parsed_candidate.linkedin_profile == $normalized_linkedin_profile
              return = {type: "single"}
              output = ["id", "elastic_search_document_id", "linkedin_profile"]
            } as $existing_candidate

            conditional {
              if ($existing_candidate != null) {
                // Association handling for existing candidate
                db.query project_person_association {
                  where = $db.project_person_association.project_id == $input.project_id && $db.project_person_association.person_type == "candidate" && $db.project_person_association.person_id == $existing_candidate.id
                  return = {type: "single"}
                  output = ["id", "current_stage_id"]
                } as $existing_association

                conditional {
                  if ($existing_association == null) {
                    db.add project_person_association {
                      data = {
                        created_at       : "now"
                        project_id       : $input.project_id
                        person_id        : $existing_candidate.id
                        person_type      : "candidate"
                        current_stage_id : $input.stage_id
                        updated_at       : now
                        added_by_user_id : $effective_added_by_user_id
                        elastic_search_id: $existing_candidate.elastic_search_document_id
                      }
                    } as $existing_association

                    function.run association_project_change_stage {
                      input = {
                        project_person_association_id: $existing_association.id
                        activity_type                : "created"
                        stage_id                     : $input.stage_id
                        user_id                      : $effective_added_by_user_id
                      }
                    } as $assigned_stage_history
                  }
                
                  else {
                    conditional {
                      if ($existing_association.current_stage_id != $input.stage_id) {
                        function.run association_project_change_stage {
                          input = {
                            project_person_association_id: $existing_association.id
                            activity_type                : "stage_change"
                            stage_id                     : $input.stage_id
                            user_id                      : $effective_added_by_user_id
                          }
                        } as $updated_stage_history
                      }
                    }
                  }
                }

                var.update $summary {
                  value = $summary
                    |set:"assigned_count":($summary.assigned_count + 1)
                }

                var.update $results {
                  value = $results
                    |push:```
                      {
                        status           : "assigned"
                        candidate_id     : $existing_candidate.id
                        association_id   : $existing_association.id
                        person_type      : "candidate"
                        linkedin_profile : $existing_candidate.linkedin_profile
                      }
                      ```
                }

                continue
              }
            }

            // Create new candidate
            var $candidate_es_doc {
              value = {}
                |set:"first_name":$candidate_first_name
                |set:"last_name":$candidate_last_name
                |set:"linkedin_profile":$normalized_linkedin_profile
                |set:"linkedin_slug":$linkedin_slug
            }

            function.run "elastic_search/document" {
              input = {
                index : "candidates"
                method: "POST"
                doc   : $candidate_es_doc
              }
            } as $candidate_es_create

            conditional {
              if ($candidate_es_create == null || $candidate_es_create == 404) {
                var.update $summary {
                  value = $summary
                    |set:"failed_count":($summary.failed_count + 1)
                }
              
                var.update $results {
                  value = $results
                    |push:```
                      {
                        status          : "failed"
                        linkedin_profile: $candidate_display_profile
                        error           : "Failed to create candidate in Elasticsearch"
                      }
                      ```
                }
              
                continue
              }
            }

            var $candidate_elastic_search_document_id {
              value = $candidate_es_create|get:"_id"
            }

            conditional {
              if ($candidate_elastic_search_document_id == null || $candidate_elastic_search_document_id == "") {
                var.update $summary {
                  value = $summary
                    |set:"failed_count":($summary.failed_count + 1)
                }
              
                var.update $results {
                  value = $results
                    |push:```
                      {
                        status          : "failed"
                        linkedin_profile: $candidate_display_profile
                        error           : "ElasticSearch response missing document id"
                      }
                      ```
                }
              
                continue
              }
            }

            conditional {
              if ($candidate_email != "") {
                db.add parsed_candidate {
                  data = {
                    created_at                : now
                    first_name                : $candidate_first_name
                    last_name                 : $candidate_last_name
                    email                     : $candidate_email
                    linkedin_profile          : $normalized_linkedin_profile
                    elastic_search_document_id: $candidate_elastic_search_document_id
                  }
                } as $candidate
              }
            
              else {
                db.add parsed_candidate {
                  data = {
                    created_at                : now
                    first_name                : $candidate_first_name
                    last_name                 : $candidate_last_name
                    linkedin_profile          : $normalized_linkedin_profile
                    elastic_search_document_id: $candidate_elastic_search_document_id
                  }
                } as $candidate
              }
            }

            db.add project_person_association {
              data = {
                created_at       : "now"
                project_id       : $input.project_id
                person_id        : $candidate.id
                person_type      : "candidate"
                current_stage_id : $input.stage_id
                updated_at       : now
                added_by_user_id : $effective_added_by_user_id
                elastic_search_id: $candidate_elastic_search_document_id
              }
            } as $new_association

            conditional {
              if ($new_association == null) {
                var.update $summary {
                  value = $summary
                    |set:"failed_count":($summary.failed_count + 1)
                }
              
                var.update $results {
                  value = $results
                    |push:```
                      {
                        status          : "failed"
                        linkedin_profile: $candidate_display_profile
                        error           : "Failed to create project association"
                      }
                      ```
                }
              
                continue
              }
            }

            function.run association_project_change_stage {
              input = {
                project_person_association_id: $new_association.id
                activity_type                : "created"
                stage_id                     : $input.stage_id
                user_id                      : $effective_added_by_user_id
              }
            } as $stage_history

            var.update $summary {
              value = $summary
                |set:"created_count":($summary.created_count + 1)
            }

            var.update $results {
              value = $results
                |push:```
                  {
                    status           : "created"
                    candidate_id     : $candidate.id
                    association_id   : $new_association.id
                    person_type      : "candidate"
                    linkedin_profile : $normalized_linkedin_profile
                  }
                  ```
            }
          }

          catch {
            var.update $summary {
              value = $summary
                |set:"failed_count":($summary.failed_count + 1)
            }

            var.update $results {
              value = $results
                |push:```
                  {
                    status          : "failed"
                    linkedin_profile: $candidate_display_profile
                    error           : ($error.message != null ? $error.message : "Failed to process candidate")
                  }
                  ```
            }
          }
        }
      }
    }
  }

  response = {
    total_processed: $summary.total_processed
    created_count  : $summary.created_count
    assigned_count : $summary.assigned_count
    failed_count   : $summary.failed_count
    results        : $results
  }
}