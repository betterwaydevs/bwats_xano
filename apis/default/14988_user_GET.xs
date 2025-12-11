// Query all user records
query user verb=GET {
  input {
  }

  stack {
    db.query user {
      return = {type: "list"}
    } as $user
  }

  response = $user
}