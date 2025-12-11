function "communications/get_whatsapp_chat" {
  input {
    int person_id
    enum person_type {
      values = ["prospect", "candidate"]
    }
  
    int count?=20 filters=min:1|max:100
    int offset? filters=min:0
    bool? use_sandbox?
  }

  stack {
    precondition ($input.person_id != null && $input.person_id > 0) {
      error_type = "inputerror"
      error = "person_id is required"
    }
  
    var $person_record {
      value = null
    }
  
    var $person_phone {
      value = null
    }
  
    // Fetch the selected person to get their phone number
    conditional {
      if ($input.person_type == "prospect") {
        db.query parsed_prospect {
          where = $db.parsed_prospect.id == $input.person_id
          return = {type: "single"}
          output = ["id", "phone_number", "first_name", "last_name", "country"]
        } as $person_record
      }
    
      else {
        db.query parsed_candidate {
          where = $db.parsed_candidate.id == $input.person_id
          return = {type: "single"}
          output = ["id", "phone_number", "first_name", "last_name", "country"]
        } as $person_record
      }
    }
  
    precondition ($person_record != null) {
      error_type = "badrequest"
      error = "Person not found"
    }
  
    var.update $person_phone {
      value = ($person_record.phone_number != null ? ($person_record.phone_number|trim) : null)
    }
  
    precondition ($person_phone != null && $person_phone != "") {
      error_type = "inputerror"
      error = "Person does not have a phone number"
    }
  
    // Fetch the chat history from WHAPI
    function.run whatsapp_api_wrapper {
      input = {
        action      : "get_messages"
        phone_number: $person_phone
        count       : $input.count
        offset      : $input.offset
        use_sandbox : $input.use_sandbox
      }
    } as $whatsapp_result
  
    precondition ($whatsapp_result != null) {
      error_type = "badrequest"
      error = "Failed to retrieve WhatsApp messages"
    }
  
    var $raw_messages {
      value = []
    }
  
    conditional {
      if ($whatsapp_result.messages != null) {
        var.update $raw_messages {
          value = $whatsapp_result.messages
        }
      }
    }
  
    var $transformed_messages {
      value = []
    }
  
    foreach ($raw_messages) {
      each as $message {
        var $message_text {
          value = "Unsupported message type"
        }
      
        conditional {
          if ($message.type == "text" && $message.text != null && $message.text.body != null && $message.text.body != "") {
            var.update $message_text {
              value = $message.text.body
            }
          }
        
          else {
            conditional {
              if ($message.type == "link_preview" && $message.link_preview != null && $message.link_preview.body != null && $message.link_preview.body != "") {
                var.update $message_text {
                  value = $message.link_preview.body
                }
              }
            }
          }
        }
      
        array.push $transformed_messages {
          value = {
            id       : $message.id
            from_me  : $message.from_me
            timestamp: $message.timestamp
            status   : $message.status
            text     : $message_text
          }
        }
      }
    }
  }

  response = {
    person_id   : $input.person_id
    person_type : $input.person_type
    phone_number: $person_phone
    messages    : $transformed_messages
    total       : $transformed_messages.count
    raw_payload : $whatsapp_result
  }
}