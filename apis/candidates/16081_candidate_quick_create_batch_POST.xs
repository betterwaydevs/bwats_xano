query "candidate/quick_create_batch" verb=POST {
  api_group = "candidates"
  auth = "user"

  input {
    int project_id? filters=min:1
    int stage_id? filters=min:1
    json candidates
  }

  stack {
    precondition ($input.["candidates != null"]) {
      error_type = "inputerror"
      error = "candidates list is required"
    }
  
    function.run "candidates/candidate_quick_create_btach" {
      input = {
        project_id: $input.project_id
        stage_id  : $input.stage_id
        candidates: $input.candidates
      }
    } as $batch_result
  }

  response = $batch_result

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