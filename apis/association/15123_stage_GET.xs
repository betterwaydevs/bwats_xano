// Query all stage records
query stage verb=GET {
  api_group = "association"
  auth = "user"

  input {
  }

  stack {
    db.query stage {
      return = {type: "list"}
    } as $model
  }

  response = $model
}