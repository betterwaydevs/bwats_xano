// Delete parsed_prospect record
query "candidates/{candidate_id}" verb=DELETE {
  auth = "user"

  input {
    int parsed_candidate_id? filters=min:1
  }

  stack {
    db.query project_person_association {
      where = $db.project_person_association.person_id == $input.parsed_candidate_id && $db.project_person_association.person_type == "candidate"
      return = {type: "list"}
      output = ["id", "project_id"]
    } as $project_person_association1
  
    var $has_project_links {
      value = false
    }
  
    conditional {
      if ($project_person_association1 != null) {
        foreach ($project_person_association1) {
          each as $association_entry {
            conditional {
              if ($association_entry.project_id == null) {
                db.del project_person_association {
                  field_name = "id"
                  field_value = $association_entry.id
                }
              }
            
              else {
                var.update $has_project_links {
                  value = true
                }
              }
            }
          }
        }
      }
    }
  
    precondition ($has_project_links == false) {
      error = "Cant delete due to association"
    }
  
    db.del parsed_candidate {
      field_name = "id"
      field_value = $input.parsed_candidate_id
    }
  
    db.get parsed_candidate {
      field_name = "id"
      field_value = $input.parsed_candidate_id
    } as $parsed_candidate
  }

  response = $parsed_candidate
}