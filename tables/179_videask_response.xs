// Stores detailed VideoAsk interaction history for each person, identified by their email.
table videask_response {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Unique identifier for the person participating in VideoAsk interactions.
    text email? filters=trim
  
    // A list of VideoAsk touchpoints and their details.
    json[] interactions?
  
    // Timestamp indicating when the interactions were last synced.
    timestamp last_synced_at?
  
    // Timestamp when the record was last updated.
    timestamp updated_at?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {type: "btree", field: [{name: "email", op: "asc"}]}
    {type: "btree|unique", field: [{name: "email", op: "asc"}]}
  ]
}