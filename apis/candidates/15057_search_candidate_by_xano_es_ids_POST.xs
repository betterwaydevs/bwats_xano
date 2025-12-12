query "search/candidate_by_xano_es_ids" verb=POST {
  api_group = "candidates"
  auth = "user"

  input {
    text[] es_ids? filters=trim
  }

  stack {
    db.query parsed_candidate {
      where = $db.parsed_candidate.elastic_search_document_id in $input.es_ids
      return = {type: "list"}
    } as $parsed_candidate1
  }

  response = $parsed_candidate1
}