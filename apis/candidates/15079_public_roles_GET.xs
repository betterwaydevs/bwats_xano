query "public/roles" verb=GET {
  api_group = "candidates"

  input {
  }

  stack {
    db.query roles {
      where = $db.roles.type == "candidates"
      sort = {roles.name: "asc"}
      return = {type: "list"}
    } as $model
  }

  response = $model
}