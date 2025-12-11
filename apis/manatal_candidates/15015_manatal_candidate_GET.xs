query manatal_candidate verb=GET {
  input {
  }

  stack {
    db.query manatal_candidate {
      return = {type: "list"}
    } as $model
  }

  response = $model
}