// Add linkedin_applicants record
query linkedin_applicants verb=POST {
  api_group = "linkedin_applicants"

  input {
    dblink {
      table = "linkedin_applicants"
    }
  }

  stack {
    conditional {
      if ($input.company == "sh") {
        db.add sh_linkedin_applicants {
          data = {
            created_at      : "now"
            application_id  : $input.application_id
            name            : $input.name
            location        : $input.location
            linkedin_profile: $input.linkedin_profile
            description     : $input.description
            job_id          : $input.job_id
            company         : $input.company
          }
        } as $linkedin_applicants
      }
    
      else {
        db.add linkedin_applicants {
          data = {created_at: "now"}
        } as $linkedin_applicants
      }
    }
  }

  response = $linkedin_applicants
}