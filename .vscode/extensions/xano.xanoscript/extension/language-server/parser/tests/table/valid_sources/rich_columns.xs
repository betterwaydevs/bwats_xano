table array_columns {
  auth = false

  schema {
    int id
    timestamp created_at?=now
    text[] many_text? filters=trim
    email[] many_email_required_sensitive filters=trim|lower {
      description = "with a description"
      sensitive = true
    }
  
    enum[] many_enum_required_private {
      values = ["yes", "no"]
      description = "Some description here"
    }
  
    int[] ?many_number_nullable_sensitive_internal? {
      sensitive = true
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}