query "candidate/quick_create_batch" verb=POST {
  auth = "user"

  input {
    int project_id? filters=min:1
    int stage_id? filters=min:1
    json candidates
  }

  stack {
    precondition ($input.candidates != null) {
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
}