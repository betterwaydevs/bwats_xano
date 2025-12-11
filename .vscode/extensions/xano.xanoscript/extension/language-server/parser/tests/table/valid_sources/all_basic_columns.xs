table all_basic_columns {
  auth = false

  schema {
    int id
    timestamp created_at?=now
    text text_column?=foo filters=trim
    int int_column?
    uuid ?uuid_column?
    object object_column? {
      schema {
        int int_column?
      }
    }
  
    vector ?vector_column?
    enum enum_column? {
      values = ["true", "false"]
    }

    enum status?=queued {
      values=["queued", "sent", "failed"]
      description = "Email status."
    }
  
    date ?date_column?
    bool boolean_column?
    decimal decimal_column?
    email email_column? filters=trim|lower
    password password_column? {
      sensitive = true
      description = "foo"
    }
  
    json json_column?
    int reference_column? filters=@:dbo=36
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}