function association_project_change_stage {
  input {
    int project_person_association_id? filters=min:1
    text notes? filters=trim
    enum activity_type? {
      values = [
        "stage_change"
        "note"
        "linkedin_invitation_sent"
        "linkedin_message"
        "email_sent"
        "whatsapp_message"
        "phone_call"
        "other_contact"
        "convert_to_candidate"
        "convert_to_prospect"
        "created"
        "applied"
      ]
    }
  
    int stage_id?
    int user_id?
  }

  stack {
    conditional {
      if ($input.user_id != null && $input.user_id > 0) {
        db.get user {
          field_name = "id"
          field_value = $input.user_id
        } as $user
      }
    }
  
    var $activity_user_id {
      value = ($user != null ? $user.id : 0)
    }
  
    var $activity_user_name {
      value = ($user != null ? $user.name : "Guest")
    }
  
    db.get project_person_association {
      field_name = "id"
      field_value = $input.project_person_association_id
      addon = [
        {
          name : "project"
          input: {project_id: $output.project_id}
          as   : "_project"
        }
        {
          name : "stage"
          input: {stage_id: $output.current_stage_id}
          as   : "_stage"
        }
      ]
    } as $project_person_association
  
    db.get project {
      field_name = "id"
      field_value = $project_person_association.project_id
    } as $project
  
    db.get stage {
      field_name = "id"
      field_value = $input.stage_id
    } as $new_stage
  
    conditional {
      if ($project_person_association.person_type == "prospect") {
        db.get parsed_prospect {
          field_name = "id"
          field_value = $project_person_association.person_id
        } as $person
      }
    
      else {
        db.get parsed_candidate {
          field_name = "id"
          field_value = $project_person_association.person_id
        } as $person
      }
    }
  
    db.edit project_person_association {
      field_name = "id"
      field_value = $input.project_person_association_id
      data = {
        id              : null
        current_stage_id: $input.stage_id
        updated_at      : now
        added_by_user_id: $activity_user_id
        last_note       : $input.notes
      }
    } as $current_association
  
    db.add person_activity_history {
      data = {
        created_at          : "now"
        person_id           : $current_association.person_id
        person_type         : $current_association.person_type
        person_name         : $person.first_name|concat:$person.last_name:" "
        project_id          : $current_association.project_id
        project_name        : $project.name
        activity_type       : $input.activity_type
        old_stage_name      : $project_person_association._stage.name
        new_stage_name      : $new_stage.name
        created_by_user_id  : $activity_user_id
        created_by_user_name: $activity_user_name
        note                : $input.notes
      }
    } as $person_activity_history1
  }

  response = $current_association
}