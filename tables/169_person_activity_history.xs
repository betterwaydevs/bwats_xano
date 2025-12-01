// Immutable audit log of all interactions and activities related to individuals across projects.
table person_activity_history {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // The ID of the associated person (either a parsed_candidate or parsed_prospect).
    int person_id?
  
    // Indicates if the person is a 'prospect' or 'candidate'.
    enum person_type? {
      values = ["prospect", "candidate"]
    }
  
    // The name of the person at the time of the activity (snapshot).
    text person_name? filters=trim
  
    // The ID of the associated project (snapshot).
    int project_id?
  
    // The name of the project at the time of the activity (snapshot).
    text project_name? filters=trim
  
    // The type of activity recorded.
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
        "conversion"
        "convert_to_candidate"
        "convert_to_prospect"
        "created"
        "applied"
      ]
    
    }
  
    // The name of the stage before a change (if activity_type is 'stage_change').
    text old_stage_name? filters=trim
  
    // The name of the stage after a change (if activity_type is 'stage_change').
    text new_stage_name? filters=trim
  
    // The ID of the user who performed the activity (snapshot).
    int created_by_user_id?
  
    // The name of the user who performed the activity (snapshot).
    text created_by_user_name? filters=trim
  
    // Additional details or content related to the activity.
    text note? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree"
      field: [
        {name: "person_id", op: "asc"}
        {name: "person_type", op: "asc"}
      ]
    }
    {type: "btree", field: [{name: "project_id", op: "asc"}]}
  ]
}