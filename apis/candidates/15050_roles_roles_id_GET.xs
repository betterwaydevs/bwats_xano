query "roles/{roles_id}" verb=GET {
  api_group = "candidates"

  input {
    int roles_id? filters=min:1
  }

  stack {
    db.get roles {
      field_name = "id"
      field_value = $input.roles_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}