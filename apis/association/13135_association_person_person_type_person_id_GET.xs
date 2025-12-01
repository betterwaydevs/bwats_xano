// Query all project_person_association records
query "association/person/{person_type}/{person_id}" verb=GET {
  auth = "user"

  input {
    int person_id
    text person_type filters=trim
  }

  stack {
    db.query project_person_association {
      where = $db.project_person_association.person_type == $input.person_type && $db.project_person_association.person_id == $input.person_id
      return = {type: "list"}
    } as $model
  }

  response = $model
}