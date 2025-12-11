query "parsed_prospect/{prospect_elastic_search_id}" verb=GET {
  input {
    text prospect_elastic_search_id filters=trim
  }

  stack {
    db.get parsed_prospect {
      field_name = "elastic_search_document_id"
      field_value = $input.prospect_elastic_search_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}