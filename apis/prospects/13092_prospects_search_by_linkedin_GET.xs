query "prospects/search/by_linkedin" verb=GET {
  input {
    text slug? filters=trim
  }

  stack {
    precondition ($input.slug != "")
    db.query parsed_prospect {
      where = $db.parsed_prospect.linkedin_profile includes $input.slug
      return = {
        type  : "list"
        paging: {page: 1, per_page: 10, metadata: false}
      }
    
      output = [
        "id"
        "created_at"
        "linkedin_profile"
        "linked_recruit_profile_id"
        "linked_html"
        "public_name"
        "first_name"
        "last_name"
        "city"
        "country"
      ]
    } as $by_slug
  }

  response = $by_slug
}