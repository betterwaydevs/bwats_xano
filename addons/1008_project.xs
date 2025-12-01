addon project {
  input {
    int project_id? {
      table = "project"
    }
  }

  stack {
    db.query project {
      where = $db.project.id == $input.project_id
      return = {type: "single"}
    }
  }
}