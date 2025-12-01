// Update company record
query "company/{company_id}" verb=PUT {
  auth = "user"

  input {
    int company_id? filters=min:1
    dblink {
      table = "company"
      override = {logo: {hidden: true}}
    }
  
    file? logo?
  }

  stack {
    db.get company {
      field_name = "id"
      field_value = $input.company_id
    } as $existing_company
  
    precondition ($existing_company != null) {
      error_type = "notfound"
      error = "Company not found"
    }
  
    var $logo_asset {
      value = $existing_company.logo
    }
  
    conditional {
      if ($input.logo != null) {
        storage.create_image {
          value = $input.logo
          access = "public"
          filename = ""
        } as $logo_asset
      }
    }
  
    db.edit company {
      field_name = "id"
      field_value = $input.company_id
      data = {
        updated_at      : "now"
        name            : $input.name
        display_name    : $input.display_name
        is_visible      : $input.is_visible
        description_html: $input.description_html
        logo            : $logo_asset
        website         : $input.website
      }
    } as $model
  }

  response = $model
}