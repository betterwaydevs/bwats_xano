function "candidates/candidate_quick_create_btach" {
  input {
    text linkedin_profile filters=trim
    int project_id filters=min:1
    int stage_id filters=min:1
    text first_name filters=trim
    text last_name filters=trim
    text email? filters=trim|lower
  }

  stack {
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
      
        var $effective_added_by_user_id {
          value = $auth.id
        }
      }
    }
  
    // Section B – Pre-flight validation
    group {
      stack {
        db.get stage {
          field_name = "id"
          field_value = $input.stage_id
        } as $stage
      
        precondition ($stage != null) {
          error_type = "notfound"
          error = "Stage not found"
        }
      
        precondition ($stage.project_id == $input.project_id) {
          error_type = "badrequest"
          error = "Stage does not belong to supplied project"
        }
      
        db.get project {
          field_name = "id"
          field_value = $input.project_id
        } as $project
      
        precondition ($project != null) {
          error_type = "notfound"
          error = "Project not found"
        }
      
        db.query parsed_candidate {
          where = $db.parsed_candidate.linkedin_profile includes $linkedin_slug || $db.parsed_candidate.linkedin_profile == $normalized_linkedin_profile
          return = {type: "single"}
          output = ["id", "elastic_search_document_id", "linkedin_profile"]
        } as $existing_candidate
      
        precondition ($existing_candidate == null) {
          error_type = "inputerror"
          error = "Candidate already exists for provided LinkedIn profile"
          payload = {
            type                      : "candidate"
            candidate_id              : $existing_candidate.id
            elastic_search_document_id: $existing_candidate.elastic_search_document_id
          }
        }
      
        db.query parsed_prospect {
          where = $db.parsed_prospect.linkedin_profile includes $linkedin_slug || $db.parsed_prospect.linkedin_profile == $normalized_linkedin_profile
          return = {type: "single"}
          output = ["id", "elastic_search_document_id", "linkedin_profile"]
        } as $existing_prospect
      
        precondition ($existing_prospect == null) {
          error_type = "inputerror"
          error = "Prospect already exists for provided LinkedIn profile"
          payload = {
            type                      : "prospect"
            prospect_id               : $existing_prospect.id
            elastic_search_document_id: $existing_prospect.elastic_search_document_id
          }
        }
      }
    }
  
    // Section C – Persistence Pipeline
    group {
      stack {
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
      
        var $candidate_elastic_search_document_id {
          value = $candidate_es_create|get:"_id"
        }
      
        precondition ($candidate_elastic_search_document_id != null && $candidate_elastic_search_document_id != "") {
          error_type = "badrequest"
          error = "ElasticSearch response missing document id"
        }
      
        conditional {
          if ($input.email != null && $input.email != "") {
            db.add parsed_candidate {
              data = {
                created_at                : now
                first_name                : $input.first_name
                last_name                 : $input.last_name
                email                     : $input.email
                linkedin_profile          : $normalized_linkedin_profile
                elastic_search_document_id: $candidate_elastic_search_document_id
              }
            } as $candidate
          }
        
          else {
            db.add parsed_candidate {
              data = {
                created_at                : now
                first_name                : $input.first_name
                last_name                 : $input.last_name
                linkedin_profile          : $normalized_linkedin_profile
                elastic_search_document_id: $candidate_elastic_search_document_id
              }
            } as $candidate
          }
        }
      }
    }
  
    // Section D – Association & Stage History
    group {
      stack {
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
        } as $association
      
        precondition ($association != null) {
          error_type = "badrequest"
          error = "Failed to create project association"
        }
      
        function.run association_project_change_stage {
          input = {
            project_person_association_id: $association.id
            activity_type                : "created"
            stage_id                     : $input.stage_id
            user_id                      : $effective_added_by_user_id
          }
        } as $stage_history
      
        var $stage_history_id {
          value = $stage_history|get:"history_id"
        }
      }
    }
  }

  response = {
    candidate       : ```
      {
        id                        : $candidate.id
        elastic_search_document_id: $candidate_elastic_search_document_id
      }
      ```
    association     : ```
      {
        id             : $association.id
        project_id     : $association.project_id
        current_stage_id: $association.current_stage_id
      }
      ```
    stage_history_id: $stage_history_id
    statuses        : ```
      {
        candidate_created: $candidate != null
        stage_assigned    : $association != null
      }
      ```
  }
}