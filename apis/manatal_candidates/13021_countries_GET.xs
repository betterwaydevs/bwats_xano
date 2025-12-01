query countries verb=GET {
  input {
  }

  stack {
    db.direct_query {
      sql = "SELECT (regexp_split_to_array(manatal_candidate.address, '\\s+'))[array_length(regexp_split_to_array(manatal_candidate.address, '\\s+'), 1)] AS last_word_in_address FROM x6_143 manatal_candidate WHERE manatal_candidate.address IS NOT NULL AND manatal_candidate.address != '' GROUP BY last_word_in_address;"
      response_type = "list"
    } as $x1
  }

  response = $x1
}