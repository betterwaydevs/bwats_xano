table empty {
  auth = true
  tags = ["empty"]

  schema {
    int id
    timestamp created_at?=now
  }

  index = [
    {type: "primary", field: [{name: "id"}]} 
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}