query "candidates/update_notes" verb=POST {
  auth = "user"

  input {
    text candidate_es_id? filters=trim
    text notes? filters=trim
  }

  stack {
    db.query parsed_candidate {
      where = $db.parsed_candidate.elastic_search_document_id == $input.candidate_es_id
      return = {type: "single"}
    } as $candidate
  
    precondition ($candidate != null) {
      error = "Candidate not found for provided ElasticSearch id"
    }
  
    db.edit parsed_candidate {
      field_name = "id"
      field_value = $candidate.id
      data = {general_notes: $input.notes}
    } as $updated_candidate
  
    cloud.elasticsearch.document {
      auth_type = "API Key"
      key_id = $env.es_key_id
      access_key = $env.es_access_key
      region = ""
      method = "GET"
      index = "candidates"
      doc_id = $input.candidate_es_id
      doc = {}
    } as $es_candidate
  
    precondition ($es_candidate != null) {
      error = "ElasticSearch document not found for provided id"
    }
  
    var $es_source {
      value = $es_candidate._source
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
      index = "candidates"
      doc_id = $input.candidate_es_id
      doc = $es_source
    } as $update
  }

  response = $es_candidate
}