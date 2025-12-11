// Find candidates with empty or missing LinkedIn profiles
query linkedin_empty verb=GET {
  input {
    int page?=1
    int per_page?=20
  }

  stack {
    db.query parsed_candidate {
      where = $db.parsed_candidate.linkedin_profile == "" || $db.parsed_candidate.linkedin_profile == null
      sort = {parsed_candidate.created_at: "desc"}
      return = {
        type  : "list"
        paging: {
          page    : $input.page
          per_page: $input.per_page
          totals  : true
        }
      }
    } as $results
  }

  response = $results
}