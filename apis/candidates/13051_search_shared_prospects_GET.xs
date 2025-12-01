// Returns prospect/candidate pairs that share a linked recruit profile ID using a single paginated query.
query "search/shared_prospects" verb=GET {
  input {
    int page?=1 filters=min:1
    int per_page?=50 filters=min:1|max:500
  }

  stack {
    db.query parsed_prospect {
      join = {
        parsed_candidate: {
          table: "parsed_candidate"
          where: $db.parsed_prospect.linkedin_profile == $db.parsed_candidate.linkedin_profile
        }
      }
    
      where = $db.parsed_candidate.linked_recruit_profile_id != ""
      sort = {
        parsed_prospect.linkedin_profile : "asc"
        parsed_candidate.linkedin_profile: "asc"
        parsed_prospect.created_at       : "asc"
      }
    
      eval = {
        linked_recruit_profile_id  : $db.parsed_prospect.linked_recruit_profile_id
        prospect_id                : $db.parsed_prospect.id
        prospect_public_name       : $db.parsed_prospect.public_name
        prospect_linkedin_profile  : $db.parsed_prospect.linkedin_profile
        prospect_elastic_search_id : $db.parsed_prospect.elastic_search_document_id
        candidate_id               : $db.parsed_candidate.id
        candidate_public_name      : $db.parsed_candidate.public_name
        candidate_linkedin_profile : $db.parsed_candidate.linkedin_profile
        candidate_elastic_search_id: $db.parsed_candidate.elastic_search_document_id
      }
    
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
        "perPage"
        "itemsTotal"
        "pageTotal"
        "items.linked_recruit_profile_id"
        "items.linked_recruit_profile_id"
        "items.prospect_id"
        "items.prospect_public_name"
        "items.prospect_linkedin_profile"
        "items.prospect_elastic_search_id"
        "items.candidate_id"
        "items.candidate_public_name"
        "items.candidate_linkedin_profile"
        "items.candidate_elastic_search_id"
      ]
    } as $pairs
  }

  response = $pairs
}