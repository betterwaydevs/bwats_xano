query "book_club_meeting_registration/{book_club_meeting_registration_id}" verb=PATCH {
  auth = "user"
  input {
    int book_club_meeting_registration_id? filters=min:1
    dblink {
      table = "book_club_meeting_registration"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
    } as $raw_input
  
    db.patch book_club_meeting_registration {
      field_name = "id"
      field_value = $input.book_club_meeting_registration_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model

  history = "inherit"
  cache = {
    ttl       : 3600
    input     : true
    auth      : true
    datasource: true
    ip        : false
    headers   : ["foo=bar"]
    env       : ["some_var"]
  }
}