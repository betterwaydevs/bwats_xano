query all_cloud verb=GET {
  input
  stack {
    cloud.aws.s3.list_directory {
      bucket = "foo"
      region = "bar"
      key = "baz"
      secret = "biz"
      prefix = $env.my_var
      next_page_token = 4
    } as $x1
  
    cloud.aws.s3.sign_url {
      bucket = "a"
      region = "b"
      key = "c"
      secret = "d"
      file_key = "e"
      ttl = 300
    } as $x2
  
    cloud.aws.s3.upload_file {
      bucket = "a"
      region = "b"
      key = "c"
      secret = "d"
      file_key = "e"
      file = $input.file
      metadata = {}|set:"foo":"bar"
      object_lock_mode = ""
      object_lock_retain_until = ""
    }
  
    cloud.aws.s3.delete_file {
      bucket = "a"
      region = "b"
      key = "c"
      secret = "d"
      file_key = "e"
    }
  
    cloud.aws.s3.read_file {
      bucket = "a"
      region = "b"
      key = "c"
      secret = "d"
      file_key = "e"
    } as $x4
  
    cloud.aws.s3.get_file_info {
      bucket = "a"
      region = "b"
      key = "c"
      secret = "d"
      file_key = "e"
    } as $x5
  
    cloud.algolia.request {
      application_id = ""
      api_key = ""
      url = ""
      method = "POST"
      payload = {}
    } as $x7
  
    cloud.elasticsearch.query {
      auth_type = "API Key"
      key_id = ""
      access_key = ""
      region = ""
      index = ""
      payload = {}
      expression = []
      size = 0
      from = 0
      sort = []
      included_fields = []
      return_type = "search"
    } as $x9
    
    cloud.aws.opensearch.query {
      auth_type = "IAM"
      key_id = ""
      access_key = ""
      region = ""
      index = ""
      payload = {}
      expression = []
      size = 0
      from = 0
      sort = []
      included_fields = []
      return_type = "search"
    } as $x12

    cloud.aws.opensearch.request {
      auth_type = "IAM"
      key_id = ""
      access_key = ""
      region = ""
      method = "GET"
      url = ""
      query = {}
    } as $x10

    cloud.elasticsearch.request {
      auth_type = "API Key"
      key_id = ""
      access_key = ""
      region = ""
      method = "POST"
      url = ""
      query = ""
    } as $x6
  
  
    cloud.aws.opensearch.document {
      auth_type = "IAM"
      key_id = ""
      access_key = ""
      region = ""
      method = "GET"
      index = ""
      doc_id = ""
      doc = {}
    } as $x11
  
    cloud.elasticsearch.document {
      auth_type = "API Key"
      key_id = ""
      access_key = ""
      region = ""
      method = "GET"
      index = ""
      doc_id = ""
      doc = {}
    } as $x8
  }

  response = $x1
}