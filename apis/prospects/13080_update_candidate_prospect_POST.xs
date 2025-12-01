query update_candidate_prospect verb=POST {
  input {
    dblink {
      table = "parsed_prospect"
      override = {
        created_at       : {hidden: true}
        linked_html      : {hidden: true}
        normalized_date  : {hidden: true}
        linkedin_profile : {hidden: true}
        salary_aspiration: {hidden: true}
      }
    }
  }

  stack {
    db.edit parsed_prospect {
      field_name = "linked_recruit_profile_id"
      field_value = $input.linked_recruit_profile_id
      data = {
        parse_status              : "parsed"
        public_name               : $input.public_name
        first_name                : $input.first_name
        last_name                 : $input.last_name
        city                      : $input.city
        country                   : $input.country
        total_experience_years    : $input.total_experience_years
        short_role                : $input.short_role
        headline_role             : $input.headline_role
        role_summary              : $input.role_summary
        technical_summary         : $input.technical_summary
        github_profile            : $input.github_profile
        employment_status         : $input.employment_status
        project_id                : $input.project_id
        email                     : $input.email
        phone_number              : $input.phone_number
        availability              : $input.availability
        resume_last_modified      : $input.resume_last_modified
        profile_last_updated      : $input.profile_last_updated
        parsed_candidate_id       : $input.parsed_candidate_id
        picture                   : $input.picture
        openai_file_id            : $input.openai_file_id
        elastic_search_document_id: $input.elastic_search_document_id
        es_created_updated_date   : $input.es_created_updated_date
        languages                 : $input.languages
        skills                    : $input.skills
        work_history              : $input.work_history
        education                 : $input.education
        certifications            : $input.certifications
        industries                : $input.industries
      }
    } as $parsed_prospect1
  
    var $should_normalize {
      value = ($input.skills != null)
    }
  
    conditional {
      if ($should_normalize) {
        function.run prospect_quick_normalize_skills {
          input = {prospect_id: $parsed_prospect1.id}
        } as $normalization
      }
    }
  }

  response = $parsed_prospect1
}