query count verb=GET {
  input {
    dblink {
      table = "linkedin_applicants"
      override = {
        name            : {hidden: true}
        location        : {hidden: true}
        created_at      : {hidden: true}
        description     : {hidden: true}
        application_id  : {hidden: true}
        linkedin_profile: {hidden: true}
      }
    }
  }

  stack {
    conditional {
      if ($input.company == "sh") {
        db.query sh_linkedin_applicants {
          where = $db.sh_linkedin_applicants.job_id ==? $input.job_id
          return = {type: "count"}
        } as $linkedin_applicants
      }
    
      else {
        db.query linkedin_applicants {
          where = $db.linkedin_applicants.job_id ==? $input.job_id
          return = {type: "count"}
        } as $linkedin_applicants
      }
    }
  }

  response = $linkedin_applicants
}