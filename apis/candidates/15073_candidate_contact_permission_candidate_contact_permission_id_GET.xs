// Get candidate_contact_permission record
query "candidate_contact_permission/{candidate_contact_permission_id}" verb=GET {
  api_group = "candidates"

  input {
    int candidate_contact_permission_id? filters=min:1
  }

  stack {
    db.get candidate_contact_permission {
      field_name = "id"
      field_value = $input.candidate_contact_permission_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}