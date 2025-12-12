// Edit person_attachment record
query "person_attachment/{person_attachment_id}" verb=PATCH {
  api_group = "attachments"
  auth = "user"

  input {
    int person_attachment_id? filters=min:1
    dblink {
      table = "person_attachment"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch person_attachment {
      field_name = "id"
      field_value = $input.person_attachment_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}