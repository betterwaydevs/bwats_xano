// Delete person_attachment record
query "person_attachment/{person_attachment_id}" verb=DELETE {
  auth = "user"

  input {
    int person_attachment_id? filters=min:1
  }

  stack {
    db.del person_attachment {
      field_name = "id"
      field_value = $input.person_attachment_id
    }
  }

  response = null
}