// Query all linkedin_invitation records
query linkedin_invitation verb=GET {
  input {
    int user_id?
    int per_page?
    int page?
  }

  stack {
    db.query linkedin_invitation {
      where = $input.user_id ==? $db.linkedin_invitation.user_id
      sort = {linkedin_invitation.Invited_On: "desc"}
      return = {
        type  : "list"
        paging: {
          page    : $input.page
          per_page: $input.per_page
          totals  : true
        }
      }
    
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