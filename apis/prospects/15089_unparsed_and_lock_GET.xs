query unparsed_and_lock verb=GET {
  api_group = "prospects"

  input {
  }

  stack {
    db.query parsed_prospect {
      where = $db.parsed_prospect.linkedin_profile != "" && ($db.parsed_prospect.parse_status == "pending") || $db.parsed_prospect.parse_status == ""
      sort = {parsed_prospect.id: "asc"}
      return = {
        type  : "list"
        paging: {page: 1, per_page: 25, metadata: false}
      }
    
      output = [
        "id"
        "linkedin_profile"
        "linked_recruit_profile_id"
        "linked_html"
        "elastic_search_document_id"
      ]
    } as $parsed_prospect1
  
    foreach ($parsed_prospect1) {
      each as $item {
        db.patch parsed_prospect {
          field_name = "linked_recruit_profile_id"
          field_value = $item.linked_recruit_profile_id
          data = '{   "parse_status": "parsing" }'
        } as $parsed_prospect2
      }
    }
  }

  response = $parsed_prospect1
}