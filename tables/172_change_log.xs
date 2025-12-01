// Logs all changes made to records in other tables.
table change_log {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Name of the table where the change occurred (e.g., 'parsed_candidate').
    text table_name? filters=trim
  
    // Primary ID of the record that was changed.
    int record_id?
  
    // JSON array of field names that were modified.
    json field_keys?
  
    // JSON object containing old values of modified fields.
    json old_values?
  
    // JSON object containing new values of modified fields.
    json new_values?
  
    // ID of the user who made the change.
    int changed_by_user_id? {
      table = "user"
    }
  
    // Optional extra metadata about the change.
    json context?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree"
      field: [
        {name: "table_name", op: "asc"}
        {name: "record_id", op: "asc"}
      ]
    }
    {
      type : "btree"
      field: [{name: "changed_by_user_id", op: "asc"}]
    }
  ]
}