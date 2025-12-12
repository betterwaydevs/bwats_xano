// Edit candidate_event record
query "candidate_event/{candidate_event_id}" verb=PATCH {
  api_group = "candidates"
  auth = "user"

  input {
    int candidate_event_id? filters=min:1
    dblink {
      table = "candidate_event"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch candidate_event {
      field_name = "id"
      field_value = $input.candidate_event_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}