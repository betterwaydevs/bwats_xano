function "elastic_search/document" {
  input {
    // Target index where the document lives
    text index filters=trim
  
    // HTTP method to perform (GET, POST, PUT, DELETE)
    enum method?=GET {
      values = ["GET", "POST", "PUT", "DELETE"]
    }
  
    // Document identifier (optional for POST)
    text doc_id? filters=trim
  
    // Document body to send (for POST/PUT)
    json doc?
  }

  stack {
    var $branch_lowercase {
      value = ($env.$branch|json_encode)|to_lower
    }
  
    var $is_dev_branch {
      value = $branch_lowercase|contains:"development"
    }
  
    // Default to production credentials
    var $key_id {
      value = $env.es_key_id
    }
  
    var $access_key {
      value = $env.es_access_key
    }
  
    var $base_url {
      value = $env.es_base_url
    }
  
    var $region {
      value = $env.elasticsearch_region
    }
  
    // Swap to dev credentials when running from the development branch
    conditional {
      if ($is_dev_branch) {
        var.update $key_id {
          value = $env.dev_es_key_id
        }
      
        var.update $access_key {
          value = $env.dev_es_access_key
        }
      
        var.update $base_url {
          value = $env.dev_es_base_url
        }
      }
    }
  
    var $serialized_doc {
      value = ($input.doc ?? {})
    }
  
    cloud.elasticsearch.document {
      auth_type = "API Key"
      key_id = $key_id
      access_key = $access_key
      region = ""
      method = $input.method
      index = $input.index
      doc_id = ($input.doc_id ?? "")
      doc = $serialized_doc
    } as $document_result
  }

  response = $document_result
}