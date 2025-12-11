// Get company record
query "company/{company_id}" verb=GET {
  auth = "user"

  input {
    int company_id? filters=min:1
  }

  stack {
    db.get company {
      field_name = "id"
      field_value = $input.company_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}