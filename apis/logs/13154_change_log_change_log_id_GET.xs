// Get change_log record
query "change_log/{change_log_id}" verb=GET {
  input {
    int change_log_id? filters=min:1
  }

  stack {
    db.get change_log {
      field_name = "id"
      field_value = $input.change_log_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}