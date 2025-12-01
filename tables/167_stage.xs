// Stores custom stages for projects, defining workflow steps.
table stage {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Foreign key to the project this stage belongs to.
    int project_id? {
      table = "project"
    }
  
    // The name of the stage (e.g., 'Search Results', 'Hired').
    text name? filters=trim
  
    // The order in which the stage appears in a sequence (e.g., Kanban board).
    int sort_order?
  
    // Optional color code for UI representation (e.g., '#3B82F6').
    text color? filters=trim
  
    // Indicates if this is a final stage (e.g., Hired, Rejected). Defaults to FALSE.
    bool is_terminal?
  
    // Timestamp when the stage record was last updated.
    timestamp updated_at?
  
    // Indicates if this stage is for 'prospects' or 'candidates'.
    enum stage_type?=prospects {
      values = ["prospects", "candidates"]
    }
  
    // Indicates if this stage is related to a specific action (e.g., LinkedIn invitation or connection).
    enum stage_action? {
      values = [
        "none"
        "linkedin_invitation"
        "linkedin_connection"
        "convert_to_candidate"
        "convert_to_prospect"
        "created"
      ]
    
    }
  
    // Boolean to indicate if this stage should limit results.
    bool limit_results?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {type: "btree", field: [{name: "project_id", op: "asc"}]}
  ]
}