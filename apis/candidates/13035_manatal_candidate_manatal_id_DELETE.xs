query "manatal_candidate/{manatal_id}" verb=DELETE {
  input {
    int manatal_candidate_id? filters=min:1
  }

  stack {
    db.del manatal_candidate {
      field_name = "manatal_id"
      field_value = $input.manatal_candidate_id
    }
  }

  response = null
}