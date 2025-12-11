// Edit remoteweekly_leads record
query "remoteweekly_leads/{remoteweekly_leads_id}" verb=PATCH {
  input {
    int remoteweekly_leads_id? filters=min:1
    dblink {
      table = "remoteweekly_leads"
    }
  }

  stack {
    db.edit remoteweekly_leads {
      field_name = "id"
      field_value = $input.remoteweekly_leads_id
      data = {}
    } as $remoteweekly_leads
  }

  response = $remoteweekly_leads
}