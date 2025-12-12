query bad_linked_in verb=GET {
  api_group = "manatal_candidates"

  input {
  }

  stack {
    db.direct_query {
      sql = "SELECT manatal_candidate.manatal_id FROM x6_143 manatal_candidate WHERE manatal_candidate.linkedin LIKE '%-';"
      response_type = "list"
    } as $x1
  }

  response = $x1
}