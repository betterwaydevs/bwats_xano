table user {
  auth = true

  schema {
    int id
    timestamp created_at?=now
    text name
    email? email
    password? password filters=min:8|minAlpha:1|minDigit:1
    bool is_admin?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree|unique", field: [{name: "email", op: "asc"}]}
  ]
}