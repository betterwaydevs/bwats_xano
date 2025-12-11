function call_open_ia {
  input {
    text prompt filters=trim
    text openai_file_id? filters=trim
  }

  stack {
    precondition ($input.prompt != null && $input.prompt != "") {
      error_type = "inputerror"
      error = "prompt is required"
    }
  
    precondition ($env.OPENAI_API_KEY != null && $env.OPENAI_API_KEY != "") {
      error = "Missing OPENAI_API_KEY environment variable"
    }
  
    function.run get_open_api_parser_prompt as $base_prompt
    var $full_prompt {
      value = $base_prompt
        |concat:"\n\n"
        |concat:$input.prompt
    }
  
    var $auth_header {
      value = "Authorization: Bearer "
    }
  
    var.update $auth_header {
      value = $auth_header|concat:$env.OPENAI_API_KEY
    }
  
    api.lambda {
      code = """
          const prompt = $var.full_prompt;
          const fileId = $input.openai_file_id;
        
          const contentItems = [
            {
              type: "input_text",
              text: prompt
            }
          ];
        
          if (fileId) {
            contentItems.push({
              type: "input_file",
              file_id: fileId
            });
          }
        
          const payload = {
            model: "gpt-4.1-mini",
            input: [
              {
                role: "user",
                content: contentItems
              }
            ]
          };
        
          return { payload };
        """
      timeout = 5
    } as $assistant_payload_builder
  
    var $assistant_payload {
      value = $assistant_payload_builder.payload
    }
  
    api.request {
      url = "https://api.openai.com/v1/responses"
      method = "POST"
      params = $assistant_payload
      headers = []
        |push:"Content-Type: application/json"
        |push:$auth_header
        |push:"OpenAI-Beta: assistants=v2"
      timeout = 90
    } as $assistant_response
  
    precondition ($assistant_response != null) {
      error = "Assistant API returned no response"
    }
  }

  response = $assistant_response.response.result.output.content.text
}