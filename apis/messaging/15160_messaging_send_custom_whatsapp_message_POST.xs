query "messaging/send_custom_whatsapp_message" verb=POST {
  api_group = "messaging"
  auth = "user"

  input {
    int person_id
    enum person_type {
      values = ["prospect", "candidate"]
    }
  
    text message filters=trim
    int history_count?=20 filters=min:1|max:100
    int history_offset? filters=min:0
    bool? use_sandbox?
  }

  stack {
    precondition ($input.person_id != null && $input.person_id > 0) {
      error_type = "inputerror"
      error = "person_id is required"
    }
  
    precondition ($input.message != null && $input.message != "") {
      error_type = "inputerror"
      error = "message is required"
    }
  
    var $person_record {
      value = null
    }
  
    conditional {
      if ($input.person_type == "prospect") {
        db.query parsed_prospect {
          where = $db.parsed_prospect.id == $input.person_id
          return = {type: "single"}
          output = ["id", "phone_number", "first_name", "last_name"]
        } as $person_record
      }
    
      else {
        db.query parsed_candidate {
          where = $db.parsed_candidate.id == $input.person_id
          return = {type: "single"}
          output = ["id", "phone_number", "first_name", "last_name"]
        } as $person_record
      }
    }
  
    precondition ($person_record != null) {
      error_type = "notfound"
      error = "Person not found"
    }
  
    var $person_phone {
      value = ($person_record.phone_number != null ? ($person_record.phone_number|trim) : null)
    }
  
    precondition ($person_phone != null && $person_phone != "") {
      error_type = "inputerror"
      error = "Person does not have a phone number"
    }
  
    // Send the custom WhatsApp message
    function.run whatsapp_api_wrapper {
      input = {
        action      : "send_message"
        phone_number: $person_phone
        message_body: $input.message
        use_sandbox : $input.use_sandbox
      }
    } as $send_result
  
    var $was_sent {
      value = ($send_result != null && (($send_result.sent != null && $send_result.sent) || ($send_result.success != null && $send_result.success)))
    }
  
    var $chat_history {
      value = null
    }
  
    conditional {
      if ($was_sent) {
        function.run "communications/get_whatsapp_chat" {
          input = {
            person_id  : $input.person_id
            person_type: $input.person_type
            count      : $input.history_count
            offset     : $input.history_offset
            use_sandbox: $input.use_sandbox
          }
        } as $chat_history
      }
    }
  
    var $response_message {
      value = ($was_sent ? "Message sent successfully" : "Failed to send message")
    }
  }

  response = {
    success     : $was_sent
    message     : $response_message
    person_id   : $input.person_id
    person_type : $input.person_type
    send_result : $send_result
    chat_history: $chat_history
  }
}