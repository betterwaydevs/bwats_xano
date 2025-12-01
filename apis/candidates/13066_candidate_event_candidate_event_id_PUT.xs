// Update candidate_event record
query "candidate_event/{candidate_event_id}" verb=PUT {
  auth = "user"

  input {
    int candidate_event_id? filters=min:1
    dblink {
      table = "candidate_event"
    }
  }

  stack {
    db.edit candidate_event {
      field_name = "id"
      field_value = $input.candidate_event_id
      data = {
        updated_at                   : $input.updated_at
        project_person_association_id: $input.project_person_association_id
        scheduled_at                 : $input.scheduled_at
        title                        : $input.title
        status                       : $input.status
      }
    } as $model
  }

  response = $model
}