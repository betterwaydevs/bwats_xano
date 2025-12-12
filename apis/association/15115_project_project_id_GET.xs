// Get project record
query "project/{project_id}" verb=GET {
  api_group = "association"

  input {
    int project_id? filters=min:1
  }

  stack {
    db.get project {
      field_name = "id"
      field_value = $input.project_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}