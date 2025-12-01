table linkedin_connections {
  auth = false

  schema {
    int id
    timestamp created_at?=now
    int user_id? {
      table = "user"
    }
  
    text First_Name? filters=trim
    text Last_Name? filters=trim
    text Connection_Profile_URL? filters=trim
    text Email_Address? filters=trim
    text Company? filters=trim
    text Position? filters=trim
    timestamp? Connected_On?=now
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree"
      field: [{name: "Connection_Profile_URL", op: "asc"}]
    }
    {
      type : "btree|unique"
      field: [
        {name: "user_id", op: "asc"}
        {name: "Connection_Profile_URL", op: "asc"}
      ]
    }
  ]
}