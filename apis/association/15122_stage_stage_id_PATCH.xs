// Edit stage record
query "stage/{stage_id}" verb=PATCH {
  api_group = "association"
  auth = "user"

  input {
    int stage_id? filters=min:1
    dblink {
      table = "stage"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch stage {
      field_name = "id"
      field_value = $input.stage_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}