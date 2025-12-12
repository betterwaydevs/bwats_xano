query "manatal_candidate/{manatal_candidate_id}" verb=PATCH {
  api_group = "manatal_candidates"

  input {
    int unique_manatal_id? filters=min:1
    dblink {
      table = "manatal_candidate"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch manatal_candidate {
      field_name = "manatal_id"
      field_value = $input.unique_manatal_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}