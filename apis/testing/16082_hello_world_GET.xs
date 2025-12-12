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

    api.lambda {
      code = """
        const r = $var.ipify;
        
        if (!r) return null;

        const ip = r.response && r.response.result && r.response.result.ip;
        return (typeof ip === "string" && ip.trim()) ? ip.trim() : null;
      """
      timeout = 1
    } as $public_ip
  
    precondition ($public_ip != null && $public_ip != "") {
      error_type = "badrequest"
      error = "Failed to retrieve public IP from ipify"
    }
  }

  response = {}
    |set:"message":"hello world"
    |set:"public_ip":$public_ip
}