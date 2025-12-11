function "video_ask/videoask_authorize_url" {
  input {
  }

  stack {
    var $client_id {
      value = $env.VIDEOASK_CLIENT_ID
    }
  
    precondition ($client_id != null && $client_id != "") {
      error_type = "inputerror"
      error = "Missing VIDEOASK_CLIENT_ID environment variable"
    }
  
    var $authorize_url {
      value = "https://auth.videoask.com/authorize?response_type=code&audience=https://api.videoask.com/&client_id="
        |concat:$client_id
        |concat:"&scope=openid%20profile%20email&redirect_uri=https://xano.atlanticsoft.co/api:vhvbSGi9/video_ask_webhook"
    }
  }

  response = $authorize_url
}