query manatal_unparsed_candidates verb=GET {
  api_group = "manatal_candidates"

  input {
  }

  stack {
    db.direct_query {
      sql = """
        SELECT manatal_candidate.*
        FROM x6_143 manatal_candidate
        WHERE manatal_candidate.parsed_date IS NULL
          AND (
            NULLIF(TRIM(COALESCE(manatal_candidate.resume_url, '')), '') IS NOT NULL
            OR (
              manatal_candidate.resume_file IS NOT NULL
              AND (manatal_candidate.resume_file ->> 'name') <> ''
              AND COALESCE(NULLIF(manatal_candidate.resume_file ->> 'size', '')::int, 0) > 0
              AND (manatal_candidate.resume_file ->> 'path') <> ''
            )
          )
        ORDER BY manatal_candidate.manatal_id DESC
        LIMIT 1000;
        """
      response_type = "list"
    } as $x1
  
    var $all_candidates {
      value = []
    }
  
    foreach ($x1) {
      each as $candidate {
        var $resume_obj {
          value = $candidate.resume_file|json_decode
        }
      
        try_catch {
          try {
            // Attempt to sign private URL; if resume_obj or path is missing, this will fail and be caught.
            storage.sign_private_url {
              pathname = $resume_obj.path
              ttl = 3000
            } as $signed
          
            var.update $candidate.resume_file {
              value = $signed
            }
          }
        }
      
        array.push $all_candidates {
          value = $candidate
        }
      }
    }
  }

  response = $all_candidates
}