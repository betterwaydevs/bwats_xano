// Manages relationships between projects and individuals (candidates/prospects).
table project_person_association {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Foreign key to the associated project.
    int project_id? {
      table = "project"
    }
  
    // The ID of the associated person (either a parsed_candidate or parsed_prospect).
    int person_id?
  
    // Indicates if the person is a 'prospect' or 'candidate'.
    enum person_type? {
      values = ["prospect", "candidate"]
    }
  
    // Foreign key to the current stage of the person within the project.
    int current_stage_id? {
      table = "stage"
    }
  
    // Timestamp when the person was added to the project.
    timestamp updated_at?
  
    // Foreign key to the user who added the person to the project.
    int added_by_user_id? {
      table = "user"
    }
  
    // The document ID from Elastic Search for this association.
    text elastic_search_id? filters=trim
  
    text last_note? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {type: "btree", field: [{name: "project_id", op: "asc"}]}
    {
      type : "btree"
      field: [
        {name: "person_id", op: "asc"}
        {name: "person_type", op: "asc"}
      ]
    }
    {
      type : "btree"
      field: [{name: "current_stage_id", op: "asc"}]
    }
    {
      type : "btree"
      field: [{name: "added_by_user_id", op: "asc"}]
    }
    {
      type : "btree"
      field: [{name: "elastic_search_id", op: "asc"}]
    }
    {
      type : "btree|unique"
      field: [
        {name: "project_id", op: "asc"}
        {name: "person_id", op: "asc"}
        {name: "person_type", op: "asc"}
      ]
    }
  ]
}