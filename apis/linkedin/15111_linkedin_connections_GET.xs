query linkedin_connections verb=GET {
  api_group = "linkedin"

  input {
    int user_id?
    int per_page?
    int page?
  }

  stack {
    db.query linkedin_connections {
      where = $input.user_id ==? $db.linkedin_connections.user_id
      sort = {linkedin_connections.Connected_On: "desc"}
      return = {
        type  : "list"
        paging: {
          page    : $input.page
          per_page: $input.per_page
          totals  : true
        }
      }
    
      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "offset"
        "perPage"
        "itemsTotal"
        "pageTotal"
        "items.id"
        "items.created_at"
        "items.user_id"
        "items.First_Name"
        "items.Last_Name"
        "items.Connection_Profile_URL"
        "items.Email_Address"
        "items.Company"
        "items.Position"
        "items.Connected_On"
      ]
    
      addon = [
        {
          name  : "user"
          output: ["name"]
          input : {user_id: $output.user_id}
          as    : "items._user"
        }
      ]
    } as $model
  }

  response = $model
}