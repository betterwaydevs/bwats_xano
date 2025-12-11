// Public company detail (limited fields)
query "company/public/{company_id}" verb=GET {
  input {
    int company_id? filters=min:1
  }

  stack {
    db.get company {
      field_name = "id"
      field_value = $input.company_id
    } as $company
  
    precondition ($company != null) {
      error_type = "notfound"
      error = "Company not found"
    }
  
    var $response_body {
      value = {
        id              : $company.id
        display_name    : ($company.display_name != null && $company.display_name != "" ? $company.display_name : $company.name)
        description_html: $company.description_html
        logo            : null
        website         : null
        is_visible      : $company.is_visible
      }
    }
  
    conditional {
      if ($company.is_visible) {
        var.update $response_body {
          value = $response_body
            |merge:```
              {
                logo   : ($company.logo != null && $company.logo.path != null ? "https://xano.atlanticsoft.co/" ~ $company.logo.path : null)
                website: $company.website
              }
              ```
        }
      }
    }
  }

  response = $response_body
}