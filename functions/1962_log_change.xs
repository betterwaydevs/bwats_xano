function log_change {
  input {
    text table_name? filters=trim
    int record_id?
    json field_keys?
    json old_values?
    json new_values?
    int changed_by_user_id?
    json context?
  }

  stack {
    db.add change_log {
      data = {
        created_at        : now
        table_name        : $input.table_name
        record_id         : $input.record_id
        field_keys        : $input.field_keys
        old_values        : $input.old_values
        new_values        : $input.new_values
        changed_by_user_id: $input.changed_by_user_id
        context           : $input.context
      }
    } as $entry
  }

  response = $entry
}