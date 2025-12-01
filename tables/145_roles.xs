table roles {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // The name or title of the role.
    text name? filters=trim
  
    // A detailed description of the role's responsibilities or characteristics.
    text description? filters=trim
  
    // Structured JSON data related to search attributes for the role.
    json search_json?
  
    text search_link? filters=trim
    enum type?=candidates {
      values = ["candidates", "prospects", "candidate_prospecting"]
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      lang : "english"
      type : "search"
      field: [{name: "name", op: "A"}]
    }
    {
      lang : "english"
      type : "search"
      field: [{name: "description", op: "A"}]
    }
  ]
}