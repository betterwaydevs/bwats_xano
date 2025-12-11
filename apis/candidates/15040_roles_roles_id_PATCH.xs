query "roles/{roles_id}" verb=PATCH {
  input {
    int roles_id? filters=min:1
    dblink {
      table = "roles"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch roles {
      field_name = "id"
      field_value = $input.roles_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}