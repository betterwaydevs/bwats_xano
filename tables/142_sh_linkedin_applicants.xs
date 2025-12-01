table sh_linkedin_applicants {
  auth = false

  schema {
    uuid id
    timestamp created_at?=now
    int application_id
    text name? filters=trim
    text location? filters=trim
    text linkedin_profile? filters=trim
    text description? filters=trim
    int job_id
    enum company?=bw {
      values = ["bw", "sh"]
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree|unique"
      field: [{name: "application_id", op: "asc"}]
    }
  ]
}