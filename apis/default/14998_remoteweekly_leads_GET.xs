// Query all remoteweekly_leads records
query remoteweekly_leads verb=GET {
  api_group = "Default"

  input {
  }

  stack {
    db.query remoteweekly_leads {
      return = {type: "list"}
    } as $remoteweekly_leads
  }

  response = $remoteweekly_leads
}