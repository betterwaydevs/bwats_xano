// Edit user record
query "user/{user_id}" verb=PATCH {
  input {
    int user_id? filters=min:1
    dblink {
      table = "user"
    }
  }

  stack {
    db.edit user {
      field_name = "id"
      field_value = $input.user_id
      data = {name: $input.name, email: $input.email}
    } as $user
  }

  response = $user
}