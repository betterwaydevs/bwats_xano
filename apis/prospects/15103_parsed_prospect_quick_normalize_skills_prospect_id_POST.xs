query "parsed_prospect/quick_normalize_skills/{prospect_id}" verb=POST {
  api_group = "prospects"

  input {
    int prospect_id? filters=min:1
  }

  stack {
    function.run prospect_quick_normalize_skills {
      input = {prospect_id: $input.prospect_id}
    } as $func_1
  }

  response = $func_1
}