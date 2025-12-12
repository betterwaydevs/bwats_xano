// API endpoint to send WhatsApp messages to prospects and candidates
query "messaging/send_whatsapp_messages" verb=POST {
  api_group = "messaging"
  auth = "user"

  input {
    json person_ids
    int project_id
    bool? use_sandbox
  }

  stack {
    // Validate inputs
    precondition ($input.person_ids != null && $input.person_ids.count > 0) {
      error = "person_ids array is required and cannot be empty"
    }
  
    precondition ($input.project_id != null && $input.project_id > 0) {
      error = "project_id is required"
    }
  
    // Call messaging function
    function.run send_whatsapp_messages {
      input = {
        person_ids : $input.person_ids
        project_id : $input.project_id
        use_sandbox: $input.use_sandbox
      }
    } as $results
  }

  response = $results
}