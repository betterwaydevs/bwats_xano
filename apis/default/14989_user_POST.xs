// Add user record
query user verb=POST {
  input {
    dblink {
      table = "user"
    }
  }

  stack {
    db.add user {
      data = {
        created_at: "now"
        name      : $input.name
        email     : $input.email
      }
    } as $user
  }

  response = $user
}