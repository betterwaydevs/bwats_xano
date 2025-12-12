// Get single person_attachment record with signed URL for private files
query "person_attachment/{person_attachment_id}" verb=GET {
  api_group = "attachments"
  auth = "user"

  input {
    int person_attachment_id
  
    // Time-to-live for signed URLs in seconds (default: 1 hour, max: 24 hours)
    int ttl?=3600 filters=min:60|max:86400
  }

  stack {
    db.get person_attachment {
      field_name = "id"
      field_value = $input.person_attachment_id
    } as $attachment
  
    // Generate signed URL if attachment exists
    conditional {
      if ($attachment != null) {
        conditional {
          if ($attachment.attachment.access == "private") {
            // Generate signed URL for private file
            storage.sign_private_url {
              pathname = $attachment.attachment.path
              ttl = $input.ttl
            } as $signed_url
          
            var $attachment_with_url {
              value = $attachment
                |set:"signed_url":$signed_url
                |set:"url_expires_in":$input.ttl
                |set:"is_private":true
            }
          }
        
          else {
            // For public files, use the existing URL
            var $attachment_with_url {
              value = $attachment
                |set:"signed_url":$attachment.attachment.url
                |set:"url_expires_in":null
                |set:"is_private":false
            }
          }
        }
      }
    
      else {
        var $attachment_with_url {
          value = null
        }
      }
    }
  }

  response = $attachment_with_url
}