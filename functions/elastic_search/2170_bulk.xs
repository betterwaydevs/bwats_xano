function "elastic_search/bulk" {
  input {
    // NDJSON payload string
    text body
  }

  stack {
    var $branch_lowercase {
      value = ($env.$branch|json_encode)|to_lower
    }
  
    var $is_dev_branch {
      value = $branch_lowercase|contains:"development"
    }
  
    var $key_id {
      value = $env.es_key_id
    }
  
    var $access_key {
      value = $env.es_access_key
    }
  
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
  
    var $api_key_combined {
      value = $key_id|concat:":"|concat:$access_key
    }
  
    var $auth_token {
      value = $api_key_combined|base64_encode
    }
  
    var $auth_header_value {
      value = "ApiKey "|concat:$auth_token
    }
  
    api.request {
      url = $base_url|concat:"/_bulk"
      method = "POST"
      params = $input.body
      headers = {
        "Content-Type": "application/x-ndjson",
        "Authorization": $auth_header_value
      }
    } as $response
  }

  response = $""
}