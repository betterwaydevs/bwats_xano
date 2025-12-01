// Delete remoteweekly_leads record.
query "remoteweekly_leads/{remoteweekly_leads_id}" verb=DELETE {
  input {
    int remoteweekly_leads_id? filters=min:1
  }

  stack {
    db.del remoteweekly_leads {
      field_name = "id"
      field_value = $input.remoteweekly_leads_id
    }
  }

  response = null
}