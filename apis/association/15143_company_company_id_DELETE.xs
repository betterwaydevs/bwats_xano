// Delete company record
query "company/{company_id}" verb=DELETE {
  auth = "user"

  input {
    int company_id? filters=min:1
  }

  stack {
    db.query project {
      where = $db.project.company_id == $input.company_id
      return = {type: "count"}
    } as $project_count
  
    precondition ($project_count == 0) {
      error_type = "inputerror"
      error = "Cannot delete company with associated projects"
    }
  
    db.del company {
      field_name = "id"
      field_value = $input.company_id
    }
  }

  response = null
}