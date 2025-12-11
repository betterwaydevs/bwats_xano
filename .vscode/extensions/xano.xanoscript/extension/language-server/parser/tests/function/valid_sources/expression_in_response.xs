function "expression and filter in response" {
  history = 100

  input {
  }

  stack {
  }

  response = {
    with_filter          : `{"test": {"value": 1}}`|get:"test":null
    with_filter_multiline: ```
      {
        "test": {
          "value": 1
        }
      }
      ```|get:"test":null
    expression           : {"foo": [1,2,3], "bar" : false}|get:"foo"
    text                 : "text"
  }
}