table test_object {
  auth = false
  schema {
    int id
    timestamp created_at?=now
    object test? {
      schema
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

}