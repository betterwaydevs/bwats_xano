query "parsed_candidate_info/{parsed_candidate_elastic_search_id}" verb=GET {
  auth = "user"

  input {
    text parsed_candidate_elastic_search_id filters=trim
  }

  stack {
    db.get parsed_candidate {
      field_name = "elastic_search_document_id"
      field_value = $input.parsed_candidate_elastic_search_id
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
        "employment_status"
        "skills"
        "work_history"
        "education"
        "certifications"
        "email"
        "phone_number"
        "linkedin_profile"
        "github_profile"
        "availability"
        "resume_last_modified"
        "profile_last_updated"
        "industries"
        "manatal_id"
        "picture"
        "openai_file_id"
        "elastic_search_document_id"
        "normalized_date"
        "es_created_updated_date"
        "linked_recruit_profile_id"
        "old_system_notes"
        "general_notes"
      ]
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}