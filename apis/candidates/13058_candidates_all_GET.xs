// Query all parsed_candidate records
query "candidates/all" verb=GET {
  auth = "user"

  input {
    int per_page?
    int page?
  }

  stack {
    db.query parsed_candidate {
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
        "items.id"
        "items.created_at"
        "items.public_name"
        "items.first_name"
        "items.last_name"
        "items.city"
        "items.manatal_id"
        "items.elastic_search_document_id"
        "items.normalized_date"
        "items.es_created_updated_date"
        "items.linked_recruit_profile_id"
        "items.old_system_notes"
      ]
    } as $model
  }

  response = $model
}