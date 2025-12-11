// Add project record
query project verb=POST {
  auth = "user"

  input {
    dblink {
      table = "project"
    }
  }

  stack {
    db.add project {
      data = {
        created_at        : "now"
        name              : $input.name
        external_id       : $input.external_id
        description       : $input.description
        location          : $input.location
        status            : $input.status
        candidate_role_id : $input.candidate_role_id
        prospect_role_id  : $input.prospect_role_id
        messaging_template: $input.messaging_template
        email_template    : $input.email_template
        updated_at        : $input.updated_at
        created_by_user_id: $input.created_by_user_id
      }
    } as $model
  }

  response = $model
}