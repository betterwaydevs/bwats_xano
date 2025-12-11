function "communications/resend_email_wrapper" {
  input {
    text to filters=trim
    text subject? filters=trim
    text html?
    text text?
    text from filters=trim
    text cc? filters=trim
    text bcc? filters=trim
  }

  stack {
    // Validate required inputs
    precondition ($input.to != null && $input.to != "") {
      error_type = "inputerror"
      error = "to is required"
    }
  
    precondition ($input.from != null && $input.from != "") {
      error_type = "inputerror"
      error = "from is required"
    }
  
    var $from_email_only {
      value = ""
    }
  
    api.lambda {
      code = """
          const fromValue = ($input.from || '').trim().toLowerCase();
          const match = fromValue.match(/<([^>]+)>/);
          const email = match ? match[1].trim() : fromValue;
          return email;
        """
      timeout = 5
    } as $parsed_from_email
  
    var.update $from_email_only {
      value = $parsed_from_email
    }
  
    api.lambda {
      code = """
          const email = ($var.from_email_only || '').toLowerCase();
          return email.endsWith('@email.betterway.dev');
        """
      timeout = 5
    } as $is_allowed_from_domain
  
    precondition ($is_allowed_from_domain) {
      error_type = "inputerror"
      error = "from email must use @email.betterway.dev domain"
    }
  
    precondition (($input.html != null && $input.html != "") || ($input.text != null && $input.text != "")) {
      error_type = "inputerror"
      error = "Either html or text content is required"
    }
  
    precondition ((($env.RESEND_EMAIL_KEY != null && $env.RESEND_EMAIL_KEY != "") || ($env.RESEND_API_KEY != null && $env.RESEND_API_KEY != ""))) {
      error_type = "inputerror"
      error = "Missing RESEND_EMAIL_KEY or RESEND_API_KEY environment variable"
    }
  
    // Convert single email strings to JSON array strings expected by the Resend action
    api.lambda {
      code = """
          const toValue = ($input.to || '').trim();
          return JSON.stringify([toValue]);
        """
      timeout = 5
    } as $to_json
  
    conditional {
      if ($input.cc != null && $input.cc != "") {
        api.lambda {
          code = """
              const ccValue = ($input.cc || '').trim();
              return JSON.stringify([ccValue]);
            """
          timeout = 5
        } as $cc_json
      }
    }
  
    conditional {
      if ($input.bcc != null && $input.bcc != "") {
        api.lambda {
          code = """
              const bccValue = ($input.bcc || '').trim();
              return JSON.stringify([bccValue]);
            """
          timeout = 5
        } as $bcc_json
      }
    }
  
    var $resend_key {
      value = ($env.RESEND_EMAIL_KEY != null && $env.RESEND_EMAIL_KEY != "" ? $env.RESEND_EMAIL_KEY : $env.RESEND_API_KEY)
    }
  
    action.call "MY RESEND - NO FROM VALIDATION_01" {
      input = {
        to     : $to_json
        subject: ($input.subject != null ? $input.subject : "")
        text   : ($input.text != null ? $input.text : "")
        html   : ($input.html != null ? $input.html : "")
        from   : $input.from
      }
    
      registry = {resend_api_key: $env.RESEND_EMAIL_KEY}
    } as $action_response
  }

  response = {
    sent      : ($action_response != null && $action_response.id != null && $action_response.id != "")
    message_id: ($action_response != null ? $action_response.id : null)
    raw       : $action_response
  }
}