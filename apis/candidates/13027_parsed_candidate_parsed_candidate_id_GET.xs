query "parsed_candidate/{parsed_candidate_id}" verb=GET {
  input {
    int parsed_candidate_id? filters=min:1
  }

  stack {
    db.get parsed_candidate {
      field_name = "id"
      field_value = $input.parsed_candidate_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}