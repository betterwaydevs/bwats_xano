query "candidate/quick_create_batch" verb=POST {
  auth = "user"

  input {
    text linkedin_profile filters=trim
    int project_id filters=min:1
    int stage_id filters=min:1
    text first_name filters=trim
    text last_name filters=trim
    text email? filters=trim|lower
  }

  stack {
    function.run "candidates/candidate_quick_create_btach" {
      input = {
        linkedin_profile: $input.linkedin_profile
        project_id      : $input.project_id
        stage_id        : $input.stage_id
        first_name      : $input.first_name
        last_name       : $input.last_name
        email           : $input.email
      }
    } as $func1
  }

  response = $func_1

  test "should require linkedin profile" {
    input = {
      linkedin_profile: ""
      project_id      : 1
      stage_id        : 1
      first_name      : ""
      last_name       : ""
      email           : ""
    }
  
    expect.to_throw {
      exception = "Missing param: linkedin_profile"
    }
  }

  test "should reject invalid linkedin url format" {
    input = {
      linkedin_profile: "https://www.linkedin.com/in/badslug/"
      project_id      : 1
      stage_id        : 1
      first_name      : "jane"
      last_name       : "doe"
      email           : "jane.doe@example.com"
    }
  
    expect.to_throw {
      exception = "ERROR_CODE_NOT_FOUND"
    }
  }
}