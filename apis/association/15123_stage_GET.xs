// Query all stage records
query stage verb=GET {
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