query "search/total_count" verb=GET {
  input {
  }

  stack {
    cloud.elasticsearch.query {
      auth_type = "API Key"
      key_id = "mwmxdlijah"
      access_key = "pofdbdrvb3"
      region = ""
      index = "prospects"
      payload = ``
      size = ""
      from = ""
      sort = []
      included_fields = []
      return_type = "count"
    } as $x1
  }

  response = $x1
}