// Add person_attachment record
query person_attachment verb=POST {
  api_group = "attachments"
  auth = "user"

  input {
    // The ID of the person (candidate or prospect)
    int person_id
  
    // Type of person - either prospect or candidate
    enum person_type {
      values = ["prospect", "candidate"]
    }
  
    // Type of attachment being uploaded
    enum file_type?=resume {
      values = ["resume", "other"]
    }
  
    // The file to be uploaded
    file attachment
  }

  stack {
    // Validate required inputs
    precondition ($input.person_id != null) {
      error = "person_id is required"
    }
  
    precondition ($input.attachment != null) {
      error = "attachment file is required"
    }
  
    // Validate person exists - check appropriate table based on person_type
    precondition ($input.person_type == "candidate" || $input.person_type == "prospect") {
      error = "Invalid person_type. Must be 'candidate' or 'prospect'"
    }
  
    var $new_attachment {
      value = ""
    }
  
    storage.create_attachment {
      value = $input.attachment
      access = "private"
      filename = ""
    } as $new_attachment
  
    db.add person_attachment {
      data = {
        created_at : now
        person_id  : $input.person_id
        person_type: $input.person_type
        attachment : $new_attachment
        file_type  : $input.file_type
      }
    } as $model
  }

  response = $model
}