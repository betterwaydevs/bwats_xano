// Query all company records
query company verb=GET {
  api_group = "association"
  auth = "user"

  input {
  }

  stack {
    db.query company {
      return = {type: "list"}
    } as $model
  
    var $response_body {
      value = []
    }
  
    foreach ($model) {
      each as $company {
        var.update $response_body {
          value = $response_body
            |push:```
              ($company
                |merge:{
                  logo_asset: $company.logo
                  logo      : ($company.logo != null && $company.logo.path != null ? "https://xano.atlanticsoft.co/" ~ $company.logo.path : null)
                }
              )
              ```
        }
      }
    }
  }

  response = $response_body
}