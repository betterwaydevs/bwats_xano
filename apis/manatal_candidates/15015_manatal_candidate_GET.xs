query manatal_candidate verb=GET {
  api_group = "manatal_candidates"

  input {
  }

  stack {
    db.query manatal_candidate {
      return = {type: "list"}
    } as $model
  }

  response = $model
}