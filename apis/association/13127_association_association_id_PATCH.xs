// Edit project_person_association record
query "association/{association_id}" verb=PATCH {
  auth = "user"

  input {
    int project_person_association_id? filters=min:1
    dblink {
      table = "project_person_association"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch project_person_association {
      field_name = "id"
      field_value = $input.project_person_association_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}