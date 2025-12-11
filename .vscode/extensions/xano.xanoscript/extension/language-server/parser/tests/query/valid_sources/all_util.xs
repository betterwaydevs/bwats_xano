query all_util verb=GET {
  api_group = "foo"

  input
  stack {
    util.geo_distance {
      latitude_1 = 1
      longitude_1 = 2
      latitude_2 = 3
      longitude_2 = 4
    } as $x1
  
    util.get_all_input as $x2
    util.get_env as $x3
    util.ip_lookup {
      value = ""
      disabled = true
      description = ""
    } as $x6
  
    util.post_process {
      stack
    }
  
    precondition (true == true) {
      error_type = "standard"
      error = ""
    }
  
    util.set_header {
      value = ""
      duplicates = "replace"
    }
  
    util.sleep {
      value = ""
    }
  
    util.get_raw_input {
      encoding = "json"
    } as $x4
  
    util.get_vars as $x5

    util.send_email {
      service_provider = "xano"
      subject = "hellow"
      message = "Hey there"
    } as $xano_email
  
    util.send_email {
      api_key = $env.secret_key
      service_provider = "resend"
      subject = "hellow"
      message = "Hey there"
      to = "some_email@xano.com"
      bcc = []|push:"foo@goo.com"
      cc = ["me@me.com", "john@be.com"]
      from = "admin@xano.com"
      reply_to = "no-reply@xano.com"
      scheduled_at = "2025-11-26T01:01:02.00"
    }
  }

  response = $x1
}