table empty {
  auth = true
  security = {
    guid: "-iOFONN4cySSKJ0MTrPNojIWB5c"
  }

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