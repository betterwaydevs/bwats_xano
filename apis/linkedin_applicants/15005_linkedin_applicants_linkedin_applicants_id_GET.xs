// Get linkedin_applicants record
query "linkedin_applicants/{linkedin_applicants_id}" verb=GET {
  input {
    uuid linkedin_applicants_id?
  }

  stack {
    db.get linkedin_applicants {
      field_name = "id"
      field_value = $input.linkedin_applicants_id
    } as $linkedin_applicants
  
    precondition ($linkedin_applicants != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $linkedin_applicants
}