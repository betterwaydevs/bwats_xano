// Add change_log record
query change_log verb=POST {
  api_group = "logs"

  input {
    dblink {
      table = "change_log"
    }
  }

  stack {
    db.add change_log {
      data = {
        created_at        : "now"
        table_name        : $input.table_name
        record_id         : $input.record_id
        field_keys        : $input.field_keys
        old_values        : $input.old_values
        new_values        : $input.new_values
        changed_by_user_id: $input.changed_by_user_id
        context           : $input.context
      }
    } as $model
  }

  response = $model
}