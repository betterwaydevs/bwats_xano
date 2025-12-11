table empty {
  auth = true
  tags = ["empty"]

  schema {
    // the id
    int id
    // creation timestamp
    timestamp created_at?=now
  }

  index = [
    {type: "primary", field: [{name: "id"}]} 
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}