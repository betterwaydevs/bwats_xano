query roles verb=POST {
  input {
    dblink {
      table = "roles"
    }
  }

  stack {
    db.add roles {
      data = {
        created_at : "now"
        name       : $input.name
        description: $input.description
        search_json: $input.search_json
        search_link: $input.search_link
        type       : $input.type
      }
    } as $model
  }

  response = $model
}