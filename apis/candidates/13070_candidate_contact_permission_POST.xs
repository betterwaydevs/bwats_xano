// Add candidate_contact_permission record
query candidate_contact_permission verb=POST {
  input {
    dblink {
      table = "candidate_contact_permission"
    }
  }

  stack {
    function.run candidate_contact_permission {
      input = {
        candidate_id               : $input.candidate_id
        opt_in_matching_jobs       : $input.opt_in_matching_jobs
        opt_in_matching_jobs_ip    : $input.opt_in_matching_jobs_ip
        opt_in_matching_jobs_at    : $input.opt_in_matching_jobs_at
        opt_in_marketing_general   : $input.opt_in_marketing_general
        opt_in_marketing_general_ip: $input.opt_in_marketing_general_ip
        opt_in_marketing_general_at: $input.opt_in_marketing_general_at
      }
    } as $func_1
  }

  response = $func_1
}