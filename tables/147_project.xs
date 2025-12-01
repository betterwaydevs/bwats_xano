// Stores information about projects, including their names and unique identifiers.
table project {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // The name or title of the project (e.g., Senior Java Developer).
    text name? filters=trim
  
    // An external identifier for the project.
    int external_id?
  
    // A detailed description of the project.
    text description? filters=trim
  
    // The geographical location of the project.
    text location? filters=trim
  
    // The current status of the project (e.g., active, closed).
    enum status? {
      values = ["active", "closed"]
    }
  
    // Foreign key to the roles table, indicating the role for candidate search in this project.
    int candidate_role_id? {
      table = "roles"
    }
  
    // Foreign key to the roles table, indicating the role for prospect search in this project.
    int prospect_role_id? {
      table = "roles"
    }
  
    // Timestamp when the project record was last updated.
    timestamp updated_at?
  
    // Foreign key to the user who created this project.
    int created_by_user_id? {
      table = "user"
    }
  
    int company_id? {
      table = "company"
    }
  
    bool public?
  
    // A link to record a video for testing English skills.
    text english_validation_url? filters=trim
  
    // Foreign key to the stage where a self-application candidate will be added.
    int self_application_candidate_stage_id? {
      table = "stage"
    }
  
    text messaging_template? filters=trim
    text email_template? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {type: "btree", field: [{name: "status", op: "asc"}]}
  ]
}