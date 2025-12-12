// Delete project record
query "project/{project_id}" verb=DELETE {
  api_group = "association"
  auth = "user"

  input {
    int project_id? filters=min:1
  }

  stack {
    db.has stage {
      field_name = "project_id"
      field_value = $input.project_id
    } as $has_stages
  
    precondition ($has_stages == false) {
      error = "Project has stages created, delete them first"
    }
  
    db.del project {
      field_name = "id"
      field_value = $input.project_id
    }
  }

  response = null
}