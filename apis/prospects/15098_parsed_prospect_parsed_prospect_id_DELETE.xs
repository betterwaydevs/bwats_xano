// Delete parsed_prospect record
query "parsed_prospect/{parsed_prospect_id}" verb=DELETE {
  api_group = "prospects"
  auth = "user"

  input {
    int parsed_prospect_id? filters=min:1
  }

  stack {
    db.query project_person_association {
      where = $db.project_person_association.person_id == $input.parsed_prospect_id && $db.project_person_association.person_type == "prospect"
      return = {type: "list"}
    } as $project_person_association1
  
    precondition ($project_person_association1 == null) {
      error = "Cant delete due to association"
    }
  
    db.del parsed_prospect {
      field_name = "id"
      field_value = $input.parsed_prospect_id
    }
  
    db.get parsed_prospect {
      field_name = "id"
      field_value = $input.parsed_prospect_id
    } as $parsed_prospect
  }

  response = $parsed_prospect
}