query update_notes verb=POST {
  api_group = "prospects"
  auth = "user"

  input {
    text prospec_es_id? filters=trim
    text notes? filters=trim
  }

  stack {
    db.query parsed_prospect {
      where = $db.parsed_prospect.elastic_search_document_id == $input.prospec_es_id
      return = {type: "single"}
    } as $prospect
  
    precondition ($prospect != null) {
      error = "Prospect not found for provided ElasticSearch id"
    }
  
    db.edit parsed_prospect {
      field_name = "id"
      field_value = $prospect.id
      data = {general_notes: $input.notes}
    } as $updated_prospect
  
    cloud.elasticsearch.document {
      auth_type = "API Key"
      key_id = $env.es_key_id
      access_key = $env.es_access_key
      region = ""
      method = "GET"
      index = "prospects"
      doc_id = $input.prospec_es_id
      doc = {}
    } as $es_prospect
  
    precondition ($es_prospect != null) {
      error = "ElasticSearch document not found for provided id"
    }
  
    var $es_source {
      value = $es_prospect._source
    }
  
    precondition ($es_source != null) {
      error = "ElasticSearch document has no source payload for provided id"
    }
  
    var.update $es_source.notes {
      value = $input.notes
    }
  
    cloud.elasticsearch.document {
      auth_type = "API Key"
      key_id = $env.es_key_id
      access_key = $env.es_access_key
      region = ""
      method = "PUT"
      index = "prospects"
      doc_id = $input.prospec_es_id
      doc = $es_source
    } as $update
  }

  response = $es_prospect
}