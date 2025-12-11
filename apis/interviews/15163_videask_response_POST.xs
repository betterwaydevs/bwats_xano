// Get videask_response record
query videask_response verb=POST {
  auth = "user"

  input {
    text[] person_email? filters=trim
  }

  stack {
    db.query videask_response {
      where = $db.videask_response.email in $input.person_email
      return = {type: "list"}
    } as $videask_response1
  
    precondition ($videask_response1 != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $videask_response1
}