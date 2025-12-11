// Edit company record
query "company/{company_id}" verb=PATCH {
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
  
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    var $patch_data {
      value = `$input|pick:($raw_input|keys)`|filter_null
    }
  
    var $raw_keys {
      value = $raw_input|keys
    }
  
    var $raw_keys_matching_website {
      value = $raw_keys|filter:$$ == "website"
    }
  
    var $raw_keys_matching_description {
      value = $raw_keys|filter:$$ == "description_html"
    }
  
    conditional {
      if (($raw_keys_matching_website|count) > 0) {
        var.update $patch_data {
          value = $patch_data|merge:{website: $input.website}
        }
      }
    }
  
    conditional {
      if (($raw_keys_matching_description|count) > 0) {
        var.update $patch_data {
          value = $patch_data
            |merge:{description_html: $input.description_html}
        }
      }
    }
  
    var.update $patch_data {
      value = $patch_data|merge:{updated_at: now}
    }
  
    conditional {
      if ($input.logo != null && $input.logo != "") {
        storage.create_image {
          value = $input.logo
          access = "public"
          filename = ""
        } as $new_logo
      
        precondition ($new_logo != null) {
          error_type = "badrequest"
          error = "Logo upload failed"
        }
      
        var.update $patch_data {
          value = $patch_data|merge:{logo: $new_logo}
        }
      }
    }
  
    db.patch company {
      field_name = "id"
      field_value = $input.company_id
      data = $patch_data
    } as $model
  }

  response = $model
}