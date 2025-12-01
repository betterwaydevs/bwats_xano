query visitor verb=GET {
  input {
    text utm_campaign?=" " filters=trim
    text utm_medium?=" " filters=trim
    text utm_source?=" " filters=trim
  }

  stack {
    var $distinct_id {
      value = now|create_uid|concat:now:""
    }
  
    var $insert_id {
      value = $distinct_id|substr:0:31
    }
  
    var $plattform {
      value = $env.$http_headers|get:"Sec-Ch-Ua-Platform":null
    }
  
    var $browser {
      value = $env.$http_headers|get:"Sec-Ch-Ua":null
    }
  
    !debug.stop {
      value = $input.utm_campaign
    }
  
    api.request {
      url = "https://api.mixpanel.com/import?strict=1"
      method = "POST"
      params = {}
        |set:"0":({}
          |set:"event":"server side"
          |set:"properties":({}
            |set:"time":now
            |set:"distinct_id":$distinct_id
            |set:'["$insert_id"]':$insert_id
            |set:"utm_source":$input.utm_source
            |set:"utm_medium":$input.utm_medium
            |set:"utm_campaign":$input.utm_campaign
            |set:"ip":$env.$remote_ip
            |set:"os":$plattform
            |set:"browser":$browser
          )
        )
      headers = []
        |push:"Content-Type: application/json"
        |push:("Authorization: Basic %s"
          |sprintf:("e5a08a21150b4555c073707b871433f0:"|base64_encode)
        )
    } as $api1
  }

  response = $api1
}