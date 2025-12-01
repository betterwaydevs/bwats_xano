// Query all change_log records
query change_log verb=GET {
  auth = "user"

  input {
    dblink {
      table = "change_log"
    }
  
    int page?
    text per_page? filters=trim
  }

  stack {
    db.query change_log {
      where = $db.change_log.table_name ==? $input.table_name && $db.change_log.record_id ==? $input.record_id
      sort = {change_log.created_at: "desc"}
      return = {type: "list", paging: {page: 1, per_page: 25}}
      addon = [
        {
          name  : "user"
          output: ["name"]
          input : {user_id: $output.changed_by_user_id}
          as    : "items._user"
        }
      ]
    } as $model
  }

  response = $model
}