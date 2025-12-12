// Delete stage record
query "stage/{stage_id}" verb=DELETE {
  api_group = "association"
  auth = "user"

  input {
    int stage_id? filters=min:1
  }

  stack {
    db.has project_person_association {
      field_name = "current_stage_id"
      field_value = $input.stage_id
    } as $has_assigned_persons
  
    precondition ($has_assigned_persons == false)
    db.del stage {
      field_name = "id"
      field_value = $input.stage_id
    }
  }

  response = $has_assigned_persons
}