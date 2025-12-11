query "roles/{roles_id}" verb=PUT {
  input {
    int roles_id? filters=min:1
    dblink {
      table = "roles"
      override = {type: {hidden: true}}
    }
  }

  stack {
    db.edit roles {
      field_name = "id"
      field_value = $input.roles_id
      data = {search_json: $input.search_json}
    } as $model
  }

  response = $model
}