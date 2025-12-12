query "messaging/get_whatsapp_messages" verb=GET {
  api_group = "messaging"
  auth = "user"

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
  
    function.run "communications/get_whatsapp_chat" {
      input = {
        person_id  : $input.person_id
        person_type: $input.person_type
        count      : $input.count
        offset     : $input.offset
        use_sandbox: $input.use_sandbox
      }
    } as $chat
  }

  response = $chat
}