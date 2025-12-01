// Stores contact permission preferences for candidates, including opt-in flags and acknowledgment details.
table candidate_contact_permission {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Foreign key to the parsed_candidate table, linking to the specific candidate.
    int candidate_id? {
      table = "parsed_candidate"
    }
  
    // Flag indicating permission to contact about matching job opportunities.
    bool opt_in_matching_jobs?
  
    // IP address from which the 'matching jobs' permission was acknowledged.
    text opt_in_matching_jobs_ip? filters=trim
  
    // Timestamp when the 'matching jobs' permission was acknowledged.
    timestamp opt_in_matching_jobs_at?
  
    // Flag indicating permission to contact for marketing and general purposes.
    bool opt_in_marketing_general?
  
    // IP address from which the 'marketing and general' permission was acknowledged.
    text opt_in_marketing_general_ip? filters=trim
  
    // Timestamp when the 'marketing and general' permission was acknowledged.
    timestamp opt_in_marketing_general_at?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree|unique"
      field: [{name: "candidate_id", op: "asc"}]
    }
  ]
}