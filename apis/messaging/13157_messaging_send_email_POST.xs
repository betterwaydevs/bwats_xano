// API endpoint to send email messages to prospects and candidates
query "messaging/send_email" verb=POST {
  auth = "user"

  input {
    json person_ids
    int project_id
  }

  stack {
    // Validate inputs
    precondition ($input.person_ids != null && $input.person_ids.count > 0) {
      error = "person_ids array is required and cannot be empty"
    }
  
    precondition ($input.project_id != null && $input.project_id > 0) {
      error = "project_id is required"
    }
  
    function.run "communications/send_email_message" {
      input = {
        person_ids: $input.person_ids
        project_id: $input.project_id
        user_id   : $auth.id
      }
    } as $results
  }

  response = $results
}