query manatal_candidate verb=DELETE {
  input {
    int manatal_internal_id filters=min:1
  }

  stack {
    !db.del manatal_candidate {
      field_name = "manatal_id"
      field_value = 87440807
    }
  
    db.query manatal_candidate {
      where = $db.manatal_candidate.manatal_id ==? 87440807
      return = {type: "list"}
    } as $manatal_candidate
  }

  response = $manatal_candidate
}