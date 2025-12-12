// Get prospects by linked in id separed by comma
query parsed_prospect verb=POST {
  api_group = "prospects"

  input {
    text[] id? filters=trim
  }

  stack {
    db.query parsed_prospect {
      where = $db.parsed_prospect.linked_recruit_profile_id in $input.id
      return = {type: "list"}
    } as $prospects
  
    db.query parsed_candidate {
      where = $db.parsed_candidate.linked_recruit_profile_id in $input.id
      return = {type: "list"}
      output = [
        "id"
        "created_at"
        "public_name"
        "first_name"
        "last_name"
        "city"
        "country"
        "languages"
        "total_experience_years"
        "short_role"
        "headline_role"
        "role_summary"
        "technical_summary"
        "salary_aspiration"
        "github_profile"
        "employment_status"
        "skills"
        "work_history"
        "education"
        "certifications"
        "email"
        "phone_number"
        "availability"
        "resume_last_modified"
        "profile_last_updated"
        "industries"
        "picture"
        "openai_file_id"
        "elastic_search_document_id"
        "normalized_date"
        "es_created_updated_date"
        "linked_recruit_profile_id"
      ]
    } as $candidates
  
    var $candidate_as_prospect {
      value = []
    }
  
    foreach ($candidates) {
      each as $candidate {
        var $prospect_like {
          value = {
            id                        : null
            created_at                : $candidate.created_at
            linkedin_profile          : null
            linked_recruit_profile_id : $candidate.linked_recruit_profile_id
            linked_html               : null
            parse_status              : "parsed"
            public_name               : $candidate.public_name
            first_name                : $candidate.first_name
            last_name                 : $candidate.last_name
            city                      : $candidate.city
            country                   : $candidate.country
            languages                 : $candidate.languages
            total_experience_years    : $candidate.total_experience_years
            short_role                : $candidate.short_role
            headline_role             : $candidate.headline_role
            role_summary              : $candidate.role_summary
            technical_summary         : $candidate.technical_summary
            salary_aspiration         : $candidate.salary_aspiration
            github_profile            : $candidate.github_profile
            employment_status         : $candidate.employment_status
            skills                    : $candidate.skills
            work_history              : $candidate.work_history
            education                 : $candidate.education
            certifications            : $candidate.certifications
            email                     : $candidate.email
            phone_number              : $candidate.phone_number
            availability              : $candidate.availability
            resume_last_modified      : $candidate.resume_last_modified
            profile_last_updated      : $candidate.profile_last_updated
            industries                : $candidate.industries
            parsed_candidate_id       : $candidate.id
            picture                   : $candidate.picture
            openai_file_id            : $candidate.openai_file_id
            elastic_search_document_id: $candidate.elastic_search_document_id
            normalized_date           : $candidate.normalized_date
            es_created_updated_date   : $candidate.es_created_updated_date
          }
        }
      
        array.merge $candidate_as_prospect {
          value = ["prospect_like"]
        }
      }
    }
  
    var $combined {
      value = $prospects
    }
  
    foreach ($candidate_as_prospect) {
      each as $candidate_prospect {
        var $already_exists {
          value = $combined
            |filter:($this.linked_recruit_profile_id == $candidate_prospect.linked_recruit_profile_id)
        }
      
        conditional {
          if (($already_exists|count) == 0) {
            array.merge $combined {
              value = ["candidate_prospect"]
            }
          }
        }
      }
    }
  }

  response = $combined
}