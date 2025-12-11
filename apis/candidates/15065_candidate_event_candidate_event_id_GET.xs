// Get candidate_event record
query "candidate_event/{candidate_event_id}" verb=GET {
  auth = "user"

  input {
    int candidate_event_id? filters=min:1
  }

  stack {
    db.get candidate_event {
      field_name = "id"
      field_value = $input.candidate_event_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}