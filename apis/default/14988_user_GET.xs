// Query all user records
query user verb=GET {
  api_group = "Default"

  input {
  }

  stack {
    db.query user {
      return = {type: "list"}
    } as $user
  }

  response = $user
}