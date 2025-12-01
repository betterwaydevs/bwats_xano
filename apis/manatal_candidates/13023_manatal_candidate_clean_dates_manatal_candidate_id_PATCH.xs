query "manatal_candidate/clean_dates/{manatal_candidate_id}" verb=PATCH {
  input {
    int manatal_candidate_id? filters=min:1
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
      field_name = "id"
      field_value = $input.manatal_candidate_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}