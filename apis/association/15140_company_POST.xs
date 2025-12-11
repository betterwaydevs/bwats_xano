// Add company record
query company verb=POST {
  auth = "user"

  input {
    dblink {
      table = "company"
      override = {logo: {hidden: true}, updated_at: {hidden: true}}
    }
  
    file? logo?
  }

  stack {
    var $logo_asset {
      value = null
    }
  
    conditional {
      if ($input.logo != null && $input.logo != "") {
        storage.create_image {
          value = $input.logo
          access = "public"
          filename = ""
        } as $logo_asset
      }
    }
  
    db.add company {
      data = {
        created_at      : "now"
        updated_at      : now
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