// Add person_attachment record
query "public/add_resume" verb=POST {
  input {
    // Public-facing application identifier returned by quick apply
    text application_id filters=trim
  
    // The resume file to be uploaded
    file attachment
  }

  stack {
    // Validate required inputs
    precondition ($input.application_id != null && $input.application_id != "") {
      error = "application_id is required"
    }
  
    precondition ($input.attachment != null) {
      error = "attachment file is required"
    }
  
    db.get application_notification {
      field_name = "application_id"
      field_value = $input.application_id
    } as $application_notification
  
    precondition ($application_notification != null) {
      error_type = "notfound"
      error = "Application not found"
    }
  
    storage.create_attachment {
      value = $input.attachment
      access = "private"
      filename = ""
    } as $new_attachment
  
    db.edit application_notification {
      field_name = "id"
      field_value = $application_notification.id
      data = {resume: $new_attachment}
    } as $updated_notification
  
    conditional {
      if ($updated_notification.candidate_id != null) {
        db.get parsed_candidate {
          field_name = "id"
          field_value = $updated_notification.candidate_id
        } as $candidate
      
        conditional {
          if ($candidate != null) {
            db.add person_attachment {
              data = {
                created_at                 : now
                person_id                  : $candidate.id
                person_type                : "candidate"
                attachment                 : $new_attachment
                file_type                  : "resume"
                application_notification_id: $updated_notification.id
              }
            } as $candidate_attachment
          }
        }
      }
    }
  }

  response = {success: true, application_id: $input.application_id}
}