// Edit application_notification record
query "applications/{application_notification_id}" verb=PATCH {
  api_group = "candidates"

  input {
    int application_notification_id? filters=min:1
    dblink {
      table = "application_notification"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch application_notification {
      field_name = "id"
      field_value = $input.application_notification_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}