function "video_ask/refresh_token" {
  input {
    text refresh_token filters=trim
  }

  stack {
    var $client_id {
      value = $env.VIDEOASK_CLIENT_ID
    }
  
    var $client_secret {
      value = $env.VIDEOASK_SECRET
    }
  
    var $organization_id {
      value = $env.VIDEOASK_ORGANIZATION_ID
    }
  
    precondition ($input.refresh_token != null && $input.refresh_token != "") {
      error_type = "inputerror"
      error = "Missing refresh_token input"
    }
  
    precondition ($client_id != null && $client_id != "") {
      error_type = "inputerror"
      error = "Missing VIDEOASK_CLIENT_ID environment variable"
    }
  
    precondition ($client_secret != null && $client_secret != "") {
      error_type = "inputerror"
      error = "Missing VIDEOASK_SECRET environment variable"
    }
  
    precondition ($organization_id != null && $organization_id != "") {
      error_type = "inputerror"
      error = "Missing VIDEOASK_ORGANIZATION_ID"
    }
  
    var $payload {
      value = {}
        |set:"grant_type":"refresh_token"
        |set:"client_id":$client_id
        |set:"client_secret":$client_secret
        |set:"refresh_token":$input.refresh_token
    }
  
    var $org_header {
      value = "VideoAsk-Organization-Id: "|concat:$organization_id
    }
  
    api.request {
      url = "https://auth.videoask.com/oauth/token"
      method = "POST"
      params = $payload
      headers = []
        |push:"Content-Type: application/x-www-form-urlencoded"
        |push:$org_header
      timeout = 30
    } as $auth_response
  
    precondition ($auth_response != null && $auth_response.response != null) {
      error_type = "inputerror"
      error = "VideoAsk refresh token call failed"
    }
  
    var $token_data {
      value = $auth_response.response.result
    }
  
    var $access_token {
      value = $token_data|get:"access_token":null
    }
  }

  response = {
    status       : $auth_response.response.status
    headers      : $auth_response.response.headers
    token_raw    : $token_data
    access_token : $access_token
    token_type   : $token_data|get:"token_type":null
    expires_in   : $token_data|get:"expires_in":null
    refresh_token: $token_data|get:"refresh_token":null
    scope        : $token_data|get:"scope":null
  }
}