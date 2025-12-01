// Tracks scheduled events related to project-person associations for candidates.
table candidate_event {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Timestamp when the event record was last updated.
    timestamp updated_at?
  
    // Foreign key to the associated project_person_association record.
    int project_person_association_id {
      table = "project_person_association"
    }
  
    // Timestamp indicating when the event is scheduled to occur.
    timestamp scheduled_at
  
    // A short label or title for the event (e.g., 'Intro call').
    text title? filters=trim
  
    // The current status of the event.
    enum status? {
      values = ["pending", "completed"]
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree"
      field: [{name: "project_person_association_id", op: "asc"}]
    }
    {type: "btree", field: [{name: "scheduled_at", op: "asc"}]}
    {type: "btree", field: [{name: "status", op: "asc"}]}
  ]
}