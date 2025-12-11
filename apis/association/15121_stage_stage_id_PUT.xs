// Update stage record
query "stage/{stage_id}" verb=PUT {
  auth = "user"

  input {
    int stage_id? filters=min:1
    dblink {
      table = "stage"
    }
  }

  stack {
    db.edit stage {
      field_name = "id"
      field_value = $input.stage_id
      data = {
        project_id : $input.project_id
        name       : $input.name
        sort_order : $input.sort_order
        color      : $input.color
        is_terminal: $input.is_terminal
        updated_at : $input.updated_at
      }
    } as $model
  }

  response = $model
}