query "manatal_candidate/{manatal_candidate_id}" verb=GET {
  api_group = "manatal_candidates"

  input {
    int manatal_id filters=min:1
  }

  stack {
    db.get manatal_candidate {
      field_name = "manatal_id"
      field_value = $input.manatal_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}