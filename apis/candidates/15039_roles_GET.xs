query roles verb=GET {
  api_group = "candidates"

  input {
    enum[] role_type?=candidates {
      values = ["candidates", "prospects", "candidate_prospecting"]
    }
  }

  stack {
    db.query roles {
      where = $db.roles.type in $input.role_type
      sort = {roles.name: "asc"}
      return = {type: "list"}
    } as $model
  }

  response = $model
}