// Query all candidate_event records
query events_by_associations verb=POST {
  api_group = "candidates"
  auth = "user"

  input {
    int[] project_person_association_ids?
  }

  stack {
    // Return events scoped to provided association IDs when supplied; otherwise return all.
    conditional {
      if ($input.project_person_association_ids != null) {
        db.query candidate_event {
          where = $db.candidate_event.project_person_association_id in $input.project_person_association_ids
          sort = {candidate_event.scheduled_at: "desc"}
          return = {type: "list"}
        } as $model
      }
    
      else {
        db.query candidate_event {
          sort = {candidate_event.scheduled_at: "desc"}
          return = {type: "list"}
        } as $model
      }
    }
  }

  response = $model
}