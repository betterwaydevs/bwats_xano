// Query all candidate_event records
query candidate_events verb=GET {
  auth = "user"

  input {
    enum status? {
      values = ["pending", "completed"]
    }
  
    int project_person_association_id?
    dblink {
      table = "candidate_event"
      override = {
        title       : {hidden: true}
        created_at  : {hidden: true}
        updated_at  : {hidden: true}
        scheduled_at: {hidden: true}
      }
    }
  }

  stack {
    db.query candidate_event {
      where = $db.candidate_event.status ==? $input.status && $db.candidate_event.project_person_association_id ==? $input.project_person_association_id
      return = {type: "list"}
      addon = [
        {
          name : "project_person_association"
          input: {
            project_person_association_id: $output.project_person_association_id
          }
          addon: [
            {
              name : "project"
              input: {project_id: $output.project_id}
              as   : "_project"
            }
            {
              name : "parsed_candidate"
              input: {parsed_candidate_id: $output.person_id}
              as   : "_parsed_candidate"
            }
          ]
          as   : "_project_person_association"
        }
      ]
    } as $model
  }

  response = $model
}