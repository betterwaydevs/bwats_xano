function "video_ask/videoask_get_forms" {
  input {
    int limit?=200
    int offset?
  }

  stack {
    var $api_token {
      value = $env.VIDEOASK_TOKEN
    }
  
    precondition ($api_token != null && $api_token != "") {
      error_type = "inputerror"
      error = "Missing VIDEOASK_TOKEN environment variable"
    }
  
    var $organization_id {
      value = $env.VIDEOASK_ORGANIZATION_ID
    }
  
    precondition ($organization_id != null && $organization_id != "") {
      error_type = "inputerror"
      error = "Missing VIDEOASK_ORGANIZATION_ID environment variable"
    }
  
    var $endpoint_url {
      value = "https://api.videoask.com/forms"
    }
  
    var $auth_header {
      value = "Authorization: Bearer "|concat:$api_token
    }
  
    var $org_header {
      value = "VideoAsk-Organization-Id: "|concat:$organization_id
    }
  
    var $limit {
      value = $input.limit
    }
  
    conditional {
      if ($limit == null || $limit <= 0) {
        var.update $limit {
          value = 200
        }
      }
    }
  
    conditional {
      if ($limit > 200) {
        var.update $limit {
          value = 200
        }
      }
    }
  
    var $offset {
      value = $input.offset
    }
  
    conditional {
      if ($offset == null || $offset < 0) {
        var.update $offset {
          value = 0
        }
      }
    }
  
    var $params {
      value = {}
        |set:"limit":$limit
        |set:"offset":$offset
    }
  
    var $api_response {
      value = null
    }
  
    api.request {
      url = $endpoint_url
      method = "GET"
      params = $params
      headers = []
        |push:"Content-Type: application/json"
        |push:$auth_header
        |push:$org_header
      timeout = 30
    } as $api_response
  
    precondition ($api_response != null && $api_response.response != null) {
      error_type = "inputerror"
      error = "VideoAsk API returned no response"
    }
  
    var $result {
      value = $api_response.response
    }
  }

  response = $result
}