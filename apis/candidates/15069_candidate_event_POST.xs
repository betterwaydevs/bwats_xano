// Add candidate_event record
query candidate_event verb=POST {
  api_group = "candidates"
  auth = "user"

  input {
    dblink {
      table = "candidate_event"
      override = {created_at: {hidden: true}}
    }
  }

  stack {
    db.add candidate_event {
      data = {
        created_at                   : "now"
        updated_at                   : now
        project_person_association_id: $input.project_person_association_id
        scheduled_at                 : $input.scheduled_at
        title                        : $input.title
        status                       : "pending"
      }
    } as $model
  }

  response = $model
}