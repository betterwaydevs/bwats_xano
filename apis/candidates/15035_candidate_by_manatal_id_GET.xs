query candidate_by_manatal_id verb=GET {
  input {
    int manatal_id
  }

  stack {
    db.get parsed_candidate {
      field_name = "manatal_id"
      field_value = $input.manatal_id
    } as $parsed_candidate1
  }

  response = $parsed_candidate1
}