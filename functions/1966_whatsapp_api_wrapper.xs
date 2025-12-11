function whatsapp_api_wrapper {
  input {
    enum action {
      values = [
        "send_message"
        "get_message"
        "get_messages"
        "get_chat"
        "get_all_chats"
        "health"
      ]
    }
  
    text phone_number? filters=trim
    text message_id? filters=trim
    text message_body? filters=trim
    int typing_time?
    bool no_link_preview?
    bool resync?
    text quoted? filters=trim
    int count?=20 filters=min:1|max:100
    int offset? filters=min:0
    bool? use_sandbox?
  }

  stack {
    var $final_response {
      value = null
    }
  
    // Environment variable validation
    var $token {
      value = null
    }
  
    conditional {
      if ($input.use_sandbox) {
        precondition ($env.WHAPI_SANDBOX_TOKEN != null && $env.WHAPI_SANDBOX_TOKEN != "") {
          error_type = "inputerror"
          error = "Missing WHAPI_SANDBOX_TOKEN environment variable"
        }
      
        var.update $token {
          value = $env.WHAPI_SANDBOX_TOKEN
        }
      }
    
      else {
        precondition ($env.WHAPI_TOKEN != null && $env.WHAPI_TOKEN != "") {
          error_type = "inputerror"
          error = "Missing WHAPI_TOKEN environment variable"
        }
      
        var.update $token {
          value = $env.WHAPI_TOKEN
        }
      }
    }
  
    // Input validation by action
    conditional {
      if ($input.action == "send_message") {
        precondition ($input.phone_number != null && $input.phone_number != "") {
          error_type = "inputerror"
          error = "phone_number is required for send_message action"
        }
      
        precondition ($input.message_body != null && $input.message_body != "") {
          error_type = "inputerror"
          error = "message_body is required for send_message action"
        }
      }
    }
  
    conditional {
      if ($input.action == "get_message") {
        precondition ($input.message_id != null && $input.message_id != "") {
          error_type = "inputerror"
          error = "message_id is required for get_message action"
        }
      
        api.lambda {
          code = """
              const pattern = /^[A-Za-z0-9._]{4,30}-[A-Za-z0-9._]{4,14}(-[A-Za-z0-9._]{4,10})?(-[A-Za-z0-9._]{2,10})?$/;
              const messageId = ($input.message_id || '').trim();
              return { is_valid: pattern.test(messageId) };
            """
          timeout = 5
        } as $message_id_validation
      
        precondition ($message_id_validation.is_valid) {
          error_type = "inputerror"
          error = "Invalid message_id format. Use the ID returned by send_message (e.g. 6gBWpQzV-12aBcD)."
        }
      }
    }
  
    conditional {
      if ($input.action == "get_messages" || $input.action == "get_chat") {
        precondition ($input.phone_number != null && $input.phone_number != "") {
          error_type = "inputerror"
          error = "phone_number is required for " + $input.action + " action"
        }
      }
    }
  
    // Phone number formatting (for actions that need it)
    var $formatted_phone {
      value = null
    }
  
    conditional {
      if ($input.phone_number != null && $input.phone_number != "") {
        api.lambda {
          code = """
              const rawPhone = ($input.phone_number || '').trim();
              if (!rawPhone) {
                return { error: 'Empty phone number' };
              }
            
              // Remove @s.whatsapp.net suffix if provided (case-insensitive)
              const suffixRegex = /@s\.whatsapp\.net$/i;
              const phone = rawPhone.replace(suffixRegex, '');
            
              // Remove +, spaces, dashes, parentheses
              let cleaned = phone
                .replace(/^\+/, '')
                .replace(/[\s\-\(\)]/g, '');
            
              // Validate: must be digits only
              if (!/^\d+$/.test(cleaned)) {
                return { error: 'Phone number must contain only digits' };
              }
            
              // Validate length: 10-15 digits
              if (cleaned.length < 10 || cleaned.length > 15) {
                return { error: 'Phone number must be 10-15 digits' };
              }
            
              return { formatted: cleaned };
            """
          timeout = 5
        } as $phone_format_result
      
        precondition ($phone_format_result.formatted != null) {
          error_type = "inputerror"
          error = ($phone_format_result.error != null ? "Invalid phone number: " + $phone_format_result.error : "Invalid phone number format")
        }
      
        var.update $formatted_phone {
          value = $phone_format_result.formatted
        }
      }
    }
  
    // Build request based on action
    var $endpoint_url {
      value = ""
    }
  
    var $method {
      value = "GET"
    }
  
    var $request_body {
      value = null
    }
  
    // send_message action
    conditional {
      if ($input.action == "send_message") {
        var.update $endpoint_url {
          value = "https://gate.whapi.cloud/messages/text"
        }
      
        var.update $method {
          value = "POST"
        }
      
        // Build request body with optional parameters
        var $body {
          value = {}
            |set:"to":$formatted_phone
            |set:"body":$input.message_body
        }
      
        conditional {
          if ($input.typing_time != null && $input.typing_time > 0) {
            var.update $body {
              value = $body
                |set:"typing_time":$input.typing_time
            }
          }
        }
      
        conditional {
          if ($input.no_link_preview) {
            var.update $body {
              value = $body|set:"no_link_preview":true
            }
          }
        }
      
        conditional {
          if ($input.quoted != null && $input.quoted != "") {
            var.update $body {
              value = $body|set:"quoted":$input.quoted
            }
          }
        }
      
        var.update $request_body {
          value = $body
        }
      }
    }
  
    // get_message action
    conditional {
      if ($input.action == "get_message") {
        var.update $endpoint_url {
          value = "https://gate.whapi.cloud/messages/"|concat:$input.message_id
        }
      
        conditional {
          if ($input.resync) {
            var.update $endpoint_url {
              value = $endpoint_url|concat:"?resync=true"
            }
          }
        }
      }
    }
  
    // get_messages action
    conditional {
      if ($input.action == "get_messages") {
        var.update $endpoint_url {
          value = "https://gate.whapi.cloud/messages/list/"
            |concat:$formatted_phone
            |concat:"@s.whatsapp.net"
            |concat:"?count="
            |concat:$input.count
            |concat:"&offset="
            |concat:$input.offset
        }
      }
    }
  
    // get_chat action
    conditional {
      if ($input.action == "get_chat") {
        var.update $endpoint_url {
          value = "https://gate.whapi.cloud/chats/"|concat:$formatted_phone
        }
      }
    }
  
    // get_all_chats action
    conditional {
      if ($input.action == "get_all_chats") {
        var.update $endpoint_url {
          value = "https://gate.whapi.cloud/chats?count="
            |concat:$input.count
            |concat:"&offset="
            |concat:$input.offset
        }
      }
    }
  
    // health action
    conditional {
      if ($input.action == "health") {
        var.update $endpoint_url {
          value = "https://gate.whapi.cloud/channel/health"
        }
      }
    }
  
    // Build authorization header
    var $auth_header {
      value = "Authorization: Bearer "|concat:$token
    }
  
    // Make API request
    var $whapi_response {
      value = null
    }
  
    try_catch {
      try {
        conditional {
          if ($method == "POST") {
            api.request {
              url = $endpoint_url
              method = "POST"
              params = $request_body
              headers = []
                |push:"Content-Type: application/json"
                |push:$auth_header
              timeout = 30
            } as $whapi_response
          }
        
          else {
            api.request {
              url = $endpoint_url
              method = "GET"
              headers = []|push:$auth_header
              timeout = 30
            } as $whapi_response
          }
        }
      }
    
      catch {
        // Ignore request errors, whapi_response will be null
      }
    }
  
    // Return the happy response directly if available
    var $final_response {
      value = null
    }
  
    conditional {
      if ($whapi_response != null && $whapi_response.response != null) {
        var.update $final_response {
          value = $whapi_response.response
        }
      }
    
      else {
        // Fallback error response if something went wrong
        var.update $final_response {
          value = {
            error  : "Request failed or returned no response"
            details: $whapi_response
          }
        }
      }
    }
  }

  response = $final_response.result
}