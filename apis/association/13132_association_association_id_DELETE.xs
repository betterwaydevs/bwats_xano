// Delete project_person_association record
query "association/{association_id}" verb=DELETE {
  auth = "user"

  input {
    int project_person_association_id? filters=min:1
  }

  stack {
    db.del project_person_association {
      field_name = "id"
      field_value = $input.project_person_association_id
    }
  }

  response = null
}