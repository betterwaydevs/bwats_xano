// Get remoteweekly_leads record
query "remoteweekly_leads/{remoteweekly_leads_id}" verb=GET {
  api_group = "Default"

  input {
    int remoteweekly_leads_id? filters=min:1
  }

  stack {
    db.get remoteweekly_leads {
      field_name = "id"
      field_value = $input.remoteweekly_leads_id
    } as $remoteweekly_leads
  
    precondition ($remoteweekly_leads != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $remoteweekly_leads
}