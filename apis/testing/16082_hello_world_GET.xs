query hello_world verb=GET {
  api_group = "testing"

  input {
  }

  stack {
    api.request {
      url = "https://api.ipify.org?format=json"
      method = "GET"
      params = {}
      headers = []
      timeout = 10
    } as $ipify
  
    precondition ($ipify != null && $ipify.ip != null && $ipify.ip != "") {
      error_type = "badrequest"
      error = "Failed to retrieve public IP from ipify"
    }
  }

  response = {}
    |set:"message":"hello world"
    |set:"public_ip":$ipify.ip
}