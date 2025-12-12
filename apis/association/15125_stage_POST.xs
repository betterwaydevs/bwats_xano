// Add stage record
query stage verb=POST {
  api_group = "association"
  auth = "user"

  input {
    dblink {
      table = "stage"
    }
  }

  stack {
    db.add stage {
      data = {
        created_at : "now"
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