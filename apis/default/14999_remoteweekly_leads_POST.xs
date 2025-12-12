// Add remoteweekly_leads record
query remoteweekly_leads verb=POST {
  api_group = "Default"

  input {
    dblink {
      table = "remoteweekly_leads"
    }
  }

  stack {
    db.add remoteweekly_leads {
      data = {created_at: "now"}
    } as $remoteweekly_leads
  }

  response = $remoteweekly_leads
}