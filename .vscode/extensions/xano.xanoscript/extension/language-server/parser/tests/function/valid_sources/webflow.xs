function array_functions {
  input {
    // what is this argument about?
    text some_argument? filters=trim
  }

  stack {
    webflow.request {
      path = $input.some_argument
      method = "PUT"
      params = {}|set:"test":"testtest"
      timeout = 14
      follow_location = false
    } as $api1
  }

  response = $api1
}