// Add project_person_association record
query "association/project/{project_id}/people" verb=POST {
  auth = "user"

  input {
    dblink {
      table = "project_person_association"
    }
  }

  stack {
    db.get user {
      field_name = "id"
      field_value = $auth.id
    } as $user
  
    db.get stage {
      field_name = "id"
      field_value = $input.current_stage_id
    } as $stage
  
    precondition ($stage.project_id == $input.project_id) {
      error = "Wrong project"
    }
  
    db.get project {
      field_name = "id"
      field_value = $input.project_id
    } as $project
  
    conditional {
      if ($input.person_type == "candidate") {
        db.get parsed_candidate {
          field_name = "id"
          field_value = $input.person_id
        } as $person
      }
    
      else {
        db.get parsed_prospect {
          field_name = "id"
          field_value = $input.person_id
        } as $person
      }
    }
  
    db.add project_person_association {
      data = {
        created_at       : "now"
        project_id       : $input.project_id
        person_id        : $input.person_id
        person_type      : $input.person_type
        current_stage_id : $input.current_stage_id
        updated_at       : now
        added_by_user_id : $auth.id
        elastic_search_id: $input.elastic_search_id
        last_note        : $input.last_note
      }
    } as $model
  
    precondition ()
    db.add person_activity_history {
      data = {
        created_at          : "now"
        person_id           : $input.person_id
        person_type         : $input.person_type
        person_name         : $person.first_name|concat:$person.last_name:" "
        project_id          : $input.project_id
        project_name        : $project.name
        activity_type       : "stage_change"
        old_stage_name      : $input.person_type
        new_stage_name      : $stage.name
        created_by_user_id  : $auth.id
        created_by_user_name: $user.name
        note                : $input.last_note
      }
    } as $person_activity_history1
  }

  response = $model
}