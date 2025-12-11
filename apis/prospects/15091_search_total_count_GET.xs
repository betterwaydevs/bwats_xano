query "search/total_count" verb=GET {
  input {
  }

  stack {
    function.run "elastic_search/search_query" {
      input = {
        index      : "prospects"
        payload    : {}
        return_type: "count"
      }
    } as $x1
  }

  response = $x1
}