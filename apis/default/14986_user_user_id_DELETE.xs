// Delete user record.
query "user/{user_id}" verb=DELETE {
  input {
    int user_id? filters=min:1
  }

  stack {
    db.del user {
      field_name = "id"
      field_value = $input.user_id
    }
  }

  response = null
}