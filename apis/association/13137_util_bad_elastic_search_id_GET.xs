query "util/bad_elastic_search_id" verb=GET {
  input {
    int page?
    int per_page?
  }

  stack {
    db.query project_person_association {
      join = {
        parsed_candidate: {
          table: "parsed_candidate"
          where: $db.project_person_association.person_id == $db.parsed_candidate.id
        }
      }
    
      where = $db.project_person_association.person_type == "candidate" && $db.project_person_association.elastic_search_id != $db.parsed_candidate.elastic_search_document_id
      sort = {project_person_association.project_id: "asc"}
      eval = {
        association_id               : $db.project_person_association.id
        project_id                   : $db.project_person_association.project_id
        person_id                    : $db.project_person_association.person_id
        association_elastic_search_id: $db.project_person_association.elastic_search_id
        candidate_elastic_search_id  : $db.parsed_candidate.elastic_search_document_id
        candidate_public_name        : $db.parsed_candidate.public_name
        candidate_first_name         : $db.parsed_candidate.first_name
        candidate_last_name          : $db.parsed_candidate.last_name
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
        "itemsTotal"
        "pageTotal"
        "items.association_id"
        "items.project_id"
        "items.person_id"
        "items.association_elastic_search_id"
        "items.candidate_elastic_search_id"
        "items.candidate_public_name"
        "items.candidate_first_name"
        "items.candidate_last_name"
      ]
    } as $bad_associations
  
    var $updated_associations {
      value = []
    }
  
    foreach ($bad_associations.items) {
      each as $association {
        db.edit project_person_association {
          field_name = "id"
          field_value = $association.association_id
          data = {
            id               : null
            elastic_search_id: $association.candidate_elastic_search_id
          }
        } as $updated_association
      
        array.push $updated_associations {
          value = {
            association_id            : $association.association_id
            project_id                : $association.project_id
            person_id                 : $association.person_id
            previous_elastic_search_id: $association.association_elastic_search_id
            new_elastic_search_id     : $association.candidate_elastic_search_id
            updated_elastic_search_id : $updated_association.elastic_search_id
          }
        }
      }
    }
  }

  response = {
    matched_count: $bad_associations.itemsTotal
    updated_count: $updated_associations.count
    updates      : $updated_associations
  }
}