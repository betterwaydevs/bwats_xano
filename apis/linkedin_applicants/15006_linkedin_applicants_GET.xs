// Query all linkedin_applicants records
query linkedin_applicants verb=GET {
  input {
  }

  stack {
    db.query linkedin_applicants {
      sort = {linkedin_applicants.created_at: "desc"}
      return = {type: "list"}
    } as $linkedin_applicants
  }

  response = $linkedin_applicants
}