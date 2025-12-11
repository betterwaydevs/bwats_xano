// Get stage record
query "stage/{stage_id}" verb=GET {
  auth = "user"

  input {
    int stage_id? filters=min:1
  }

  stack {
    db.get stage {
      field_name = "id"
      field_value = $input.stage_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}