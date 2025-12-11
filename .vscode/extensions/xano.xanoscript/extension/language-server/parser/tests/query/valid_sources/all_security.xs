query all_security verb=GET {
  input
  stack {
    security.create_uuid as $x1
    security.create_auth_token {
      table = "empty"
      extras = {}
      expiration = 86400
      id = ""
    } as $authToken
  
    security.check_password {
      text_password = ""
      hash_password = ""
    } as $x2

    security.create_rsa_key {
      bits = 1024
      format = "object"
    } as $x2
  
    security.create_password {
      character_count = 12
      require_lowercase = true
      require_uppercase = true
      require_digit = true
      require_symbol = false
      symbol_whitelist = ""
    } as $x3
  
    security.random_number {
      min = 0
      max = 9007199254740991
    } as $x4
  
    security.random_bytes {
      length = 1
    } as $x5
  
    security.create_secret_key {
      bits = 1024
      format = "object"
    } as $crypto1
  
    security.create_rsa_key {
      bits = 1024
      format = "object"
    } as $crypto2
  
    security.create_curve_key {
      curve = "P-256"
      format = "object"
    } as $crypto3
  
    security.jwe_encode {
      headers = {}
      claims = {}
      key = ""
      key_algorithm = "A256KW"
      content_algorithm = "A256CBC-HS512"
      ttl = 0
    } as $crypto4
  
    security.jwe_decode {
      token = ""
      key = ""
      check_claims = {}
      key_algorithm = "A256KW"
      content_algorithm = "A256CBC-HS512"
      timeDrift = 0
    } as $crypto5
  
    security.jws_encode {
      headers = {}
      claims = {}
      key = ""
      signature_algorithm = "HS256"
      ttl = 0
    } as $crypto6
  
    security.jws_decode {
      token = ""
      key = ""
      check_claims = {}
      signature_algorithm = "HS256"
      timeDrift = 0
    } as $crypto7
  
    security.encrypt {
      data = ""
      algorithm = "aes-128-cbc"
      key = ""
      iv = ""
    } as $crypto8
  
    security.decrypt {
      data = ""
      algorithm = "aes-128-cbc"
      key = ""
      iv = ""
    } as $crypto9
  }

  response = $x1
}