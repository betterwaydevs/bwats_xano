table remoteweekly_positions {
  auth = false

  schema {
    int id
    timestamp created_at?=now
    text position? filters=trim
    bool active?
    bool is_search?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
  ]
}