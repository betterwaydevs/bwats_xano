query "utils/get_bad_linked_urls" verb=GET {
  api_group = "candidates"

  input {
    int page?=1 filters=min:1
    int per_page?=50 filters=min:1|max:500
  }

  stack {
    db.query parsed_candidate {
      where = ($db.parsed_candidate.linkedin_profile not includes "https://www.linkedin.com/in/" && $db.parsed_candidate.linkedin_profile != "") || $db.parsed_candidate.linkedin_profile != "" && $db.parsed_candidate.linkedin_profile ~ "/+$"
      sort = {parsed_candidate.id: "desc"}
      return = {
        type  : "list"
        paging: {
          page    : $input.page
          per_page: $input.per_page
          totals  : true
        }
      }
    
      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "offset"
        "itemsTotal"
        "pageTotal"
        "items.id"
        "items.linkedin_profile"
        "items.elastic_search_document_id"
      ]
    } as $candidates
  }

  response = $candidates
}