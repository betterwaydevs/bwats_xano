query parsed_candidate verb=GET {
  input {
    bool not_indexed?
    int page?
    date? normalized_date?
    date? elastic_search_date?
  }

  stack {
    conditional {
      if ($input.not_indexed) {
        db.query parsed_candidate {
          where = $db.parsed_candidate.elastic_search_document_id == "" && ($db.parsed_candidate.normalized_date <? $input.normalized_date && ($db.parsed_candidate.es_created_updated_date <= $input.elastic_search_date || $db.parsed_candidate.es_created_updated_date == null))
          sort = {parsed_candidate.id: "desc"}
          return = {
            type  : "list"
            paging: {page: $input.page, per_page: 50, totals: true}
          }
        } as $model
      }
    
      else {
        db.query parsed_candidate {
          where = $db.parsed_candidate.normalized_date <=? $input.normalized_date && ($db.parsed_candidate.es_created_updated_date <=? $input.elastic_search_date || $db.parsed_candidate.es_created_updated_date == null)
          sort = {parsed_candidate.id: "desc"}
          return = {
            type  : "list"
            paging: {page: $input.page, per_page: 100, totals: true}
          }
        
          output = [
            "itemsReceived"
            "curPage"
            "nextPage"
            "prevPage"
            "offset"
            "itemsTotal"
            "pageTotal"
            "items"
          ]
        } as $model
      }
    }
  }

  response = $model
}