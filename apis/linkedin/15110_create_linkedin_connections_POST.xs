query create_linkedin_connections verb=POST {
  input {
    dblink {
      table = "linkedin_connections"
    }
  }

  stack {
    precondition ($input.user_id > 0) {
      error = "Missing User id"
    }
  
    db.add linkedin_connections {
      data = {
        created_at            : "now"
        user_id               : $input.user_id
        First_Name            : $input.First_Name
        Last_Name             : $input.Last_Name
        Connection_Profile_URL: $input.Connection_Profile_URL
        Email_Address         : $input.Email_Address
        Company               : $input.Company
        Position              : $input.Position
        Connected_On          : $input.Connected_On
      }
    } as $model
  
    conditional {
      if ($model != null && $input.Connection_Profile_URL != null && $input.Connection_Profile_URL != "") {
        function.run automatic_action_association {
          input = {
            linkedin_identifier: $input.Connection_Profile_URL
            action_type        : "linkedin_connection"
            user_id            : $input.user_id
          }
        } as $stage_updates
      }
    }
  }

  response = {connection: $model, stage_updates: $stage_updates ?? {}}
}