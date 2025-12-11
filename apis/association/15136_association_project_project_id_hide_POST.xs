// Query all project_person_association records
query "association/project/{project_id}/hide" verb=POST {
  auth = "user"

  input {
    int project_id
    text[] elastic_search_id? filters=trim
  }

  stack {
    db.query project_person_association {
      where = $db.project_person_association.project_id == $input.project_id && $db.project_person_association.elastic_search_id in $input.elastic_search_id
      sort = {project_person_association.updated_at: "desc"}
      return = {type: "list"}
      output = ["elastic_search_id"]
    } as $model
  }

  response = $model
}