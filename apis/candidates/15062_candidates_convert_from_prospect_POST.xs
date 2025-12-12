query "candidates/convert_from_prospect" verb=POST {
  api_group = "candidates"
  auth = "user"

  input {
    int prospect_id? filters=min:1
  }

  stack {
    function.run candidates_convert_from_prospect {
      input = {prospect_id: $input.prospect_id}
    } as $func_1
  }

  response = $func_1
}