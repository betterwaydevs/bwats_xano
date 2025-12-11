query last_applicant verb=GET {
  input {
  }

  stack {
    db.query linkedin_applicants {
      sort = {linkedin_applicants.created_at: "desc"}
      return = {type: "single"}
    } as $linkedin_applicants1
  }

  response = $linkedin_applicants1
}