// Query all person_attachment records
query "person_attachment/{person_type}/{person_id}" verb=GET {
  auth = "user"

  input {
    int person_id
    text person_type filters=trim
  }

  stack {
    db.query person_attachment {
      where = $db.person_attachment.person_id == $input.person_id && $db.person_attachment.person_type == $input.person_type
      sort = {person_attachment.created_at: "desc"}
      return = {type: "list"}
    } as $model
  }

  response = $model
}