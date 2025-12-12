query "count/quick_normalized_prospects" verb=GET {
  api_group = "prospects"

  input {
  }

  stack {
    db.query parsed_prospect {
      where = `$db.parsed_prospect.is_quick_normalized`
      return = {type: "count"}
    } as $prospect_count
  }

  response = $prospect_count
}