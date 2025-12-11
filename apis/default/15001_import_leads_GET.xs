query importLeads verb=GET {
  input {
    int page
    text position filters=trim
  }

  stack {
    function.run importLeads {
      input = {page: $input.page, position: $input.position}
    } as $func_1
  }

  response = $func_1
}