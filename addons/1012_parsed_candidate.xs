addon parsed_candidate {
  input {
    int parsed_candidate_id? {
      table = "parsed_candidate"
    }
  }

  stack {
    db.query parsed_candidate {
      where = $db.parsed_candidate.id == $input.parsed_candidate_id
      return = {type: "single"}
    }
  }
}