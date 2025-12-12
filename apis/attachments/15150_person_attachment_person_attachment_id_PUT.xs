// Update person_attachment record
query "person_attachment/{person_attachment_id}" verb=PUT {
  api_group = "attachments"
  auth = "user"

  input {
    int person_attachment_id? filters=min:1
    dblink {
      table = "person_attachment"
    }
  }

  stack {
    db.edit person_attachment {
      field_name = "id"
      field_value = $input.person_attachment_id
      data = {
        person_id  : $input.person_id
        person_type: $input.person_type
        attachment : $input.attachment
        file_type  : $input.file_type
      }
    } as $model
  }

  response = $model
}