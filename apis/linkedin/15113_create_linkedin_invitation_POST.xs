// Add linkedin_invitation record
query create_linkedin_invitation verb=POST {
  api_group = "linkedin"

  input {
    dblink {
      table = "linkedin_invitation"
    }
  }

  stack {
    db.add linkedin_invitation {
      data = {
        created_at            : "now"
        user_id               : $input.user_id
        First_Name            : $input.First_Name
        Last_Name             : $input.Last_Name
        Connection_Profile_URL: $input.Connection_Profile_URL
        Message               : $input.Message
        Invited_On            : $input.Invited_On
        Position              : $input.Position
      }
    } as $model
  
    conditional {
      if ($model != null && $input.Connection_Profile_URL != null && $input.Connection_Profile_URL != "") {
        function.run automatic_action_association {
          input = {
            linkedin_identifier: $input.Connection_Profile_URL
            action_type        : "linkedin_invitation"
            user_id            : $input.user_id
          }
        } as $stage_updates
      }
    }
  }

  response = {invitation: $model, stage_updates: $stage_updates ?? {}}
}