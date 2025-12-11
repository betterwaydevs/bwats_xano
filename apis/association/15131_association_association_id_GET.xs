// Get project_person_association record
query "association/{association_id}" verb=GET {
  auth = "user"

  input {
    int project_person_association_id? filters=min:1
  }

  stack {
    db.get project_person_association {
      field_name = "id"
      field_value = $input.project_person_association_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}