addon project_person_association {
  input {
    int project_person_association_id? {
      table = "project_person_association"
    }
  }

  stack {
    db.query project_person_association {
      where = $db.project_person_association.id == $input.project_person_association_id
      return = {type: "single"}
    }
  }
}