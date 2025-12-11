query xanoscript_all_basics verb=GET {
  input {
    text some_text_value filters=trim {
      description = "and a description"
      sensitive = true
    }
  }

  stack {
    var some_var {
      value = $env.$remote_ip
    }
  
    conditional {
      if (`($some_var)|strlen > 4`) {
        db.add 48 {
          data = {id: "null", created_at: '"now"', "@meta": "null"}
        } as empty1
      }
    
      else {
        api.request {
          url = "https://webhook.site/8aa94772-0457-4b62-803d-69b63d2664d1"
          method = "GET"
          params = `{"value": "yup it's long"}`
        } as api1
      }
    }
  
    foreach (`["1","2","3","4","5","6"]`) {
      each as item {
        var.update some_var {
          value = $some_var|concat:$item:" + "
        }
      
        debug.log {
          value = $some_var
        }
      }
    }
  }

  response = $some_var
}