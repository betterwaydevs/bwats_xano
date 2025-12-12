// Edit project record
query "project/{project_id}" verb=PATCH {
  api_group = "association"
  auth = "user"

  input {
    int project_id? filters=min:1
    dblink {
      table = "project"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch project {
      field_name = "id"
      field_value = $input.project_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}