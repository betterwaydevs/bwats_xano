// Abstraction layer for Elasticsearch search query. Gets credentials from environment variables and passes through all search parameters.
function "elastic_search/search_query" {
  input {
    // The Elasticsearch index to search
    text index filters=trim
  
    // The Elasticsearch query payload (DSL query body)
    json payload?
  
    // Number of results to return (page size)
    int? size?
  
    // Offset for pagination (starting position)
    int? from?
  
    // Array of sort options, e.g. [{field: 'created_at', order: 'desc'}]
    json? sort?
  
    // Fields to include in the response (_source filtering)
    text[]? included_fields?
  
    // Type of query to execute: search, count, or aggregate
    enum return_type?=search {
      values = ["search", "count", "aggregate"]
    }
  }

  stack {
    var $branch_lowercase {
      value = ($env.$branch ?? "")|to_lower
    }
  
    var $is_dev_branch {
      value = $branch_lowercase|contains:"development"
    }
  
    // Get Elasticsearch credentials from environment variables
    // Elasticsearch API key ID from environment
    var $key_id {
      value = $env.es_key_id
    }
  
    // Elasticsearch access key from environment
    var $access_key {
      value = $env.es_access_key
    }
  
    // Base URL for the Elasticsearch cluster (documented so it can be patched in Xano UI)
    var $base_url {
      value = $env.es_base_url
    }
  
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
  
    // Ensure payload is a JSON object/string before sending to Elasticsearch
    !var $serialized_payload {
      value = ($input.payload ?? {})
    }
  
    // Execute Elasticsearch search query with env credentials
    cloud.elasticsearch.query {
      auth_type = "API Key"
      key_id = $key_id
      access_key = $access_key
      region = ""
      index = $input.index
      payload = `$input.payload`
      size = $input.size
      from = $input.from
      sort = $input.sort
      included_fields = $input.included_fields
      return_type = $input.return_type
    } as $search_result
  }

  response = $search_result
}