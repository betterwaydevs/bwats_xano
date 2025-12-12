// Update project_person_association record
query "association/id/{project_person_association_id}/change-stage" verb=POST {
  api_group = "association"
  auth = "user"

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
      ]
    }
  
    int stage_id?
  }

  stack {
    function.run association_project_change_stage {
      input = {
        project_person_association_id: $input.project_person_association_id
        notes                        : $input.notes
        activity_type                : $input.activity_type
        stage_id                     : $input.stage_id
        user_id                      : $auth.id
      }
    } as $func_1
  }

  response = $func_1
}