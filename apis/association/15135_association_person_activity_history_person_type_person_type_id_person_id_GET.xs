query "association/person_activity_history/person_type/{person_type}/id/{person_id}" verb=GET {
  api_group = "association"
  auth = "user"

  input {
    int person_id? filters=min:1
    text person_type? filters=trim
  }

  stack {
    db.query person_activity_history {
      where = $db.person_activity_history.person_id == $input.person_id && $db.person_activity_history.person_type == $input.person_type
      sort = {person_activity_history.created_at: "desc"}
      return = {type: "list"}
      addon = [
        {
          name  : "project"
          output: ["id", "name"]
          input : {project_id: $output.project_id}
          as    : "_project"
        }
      ]
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}