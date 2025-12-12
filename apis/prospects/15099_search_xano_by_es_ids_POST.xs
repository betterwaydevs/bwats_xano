query "search/xano_by_es_ids" verb=POST {
  api_group = "prospects"
  auth = "user"

  input {
    text[] es_ids? filters=trim
  }

  stack {
    db.query parsed_prospect {
      where = $db.parsed_prospect.elastic_search_document_id in $input.es_ids
      return = {type: "list"}
      output = ["id", "elastic_search_document_id"]
    } as $parsed_prospect1
  }

  response = $parsed_prospect1
}