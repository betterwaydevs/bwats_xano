// Get project record
query "project/{project_id}/stages" verb=GET {
  api_group = "association"
  auth = "user"

  input {
    int project_id? filters=min:1
    enum stage_type?=prospects {
      values = ["prospects", "candidates"]
    }
  }

  stack {
    db.query stage {
      where = $db.stage.project_id == $input.project_id && $db.stage.stage_type == $input.stage_type
      sort = {stage.stage_type: "asc", stage.sort_order: "asc"}
      return = {type: "list"}
      output = [
        "id"
        "created_at"
        "project_id"
        "name"
        "sort_order"
        "color"
        "is_terminal"
        "updated_at"
        "stage_type"
        "stage_action"
        "limit_results"
      ]
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}