// Stores information about accounts that users belong to hello
table account {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // The name of the company.
    text name? filters=trim
  
    // A brief description of the company.
    text description? filters=trim
  
    text location? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      name : "search1"
      lang : "simple"
      type : "search"
      field: [{name: "name", op: "A"}]
    }
  ]

  tags = ["xano:quick-start"]
}