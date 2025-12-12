// Add remoteweekly_positions record
query remoteweekly_positions verb=POST {
  api_group = "Default"

  input {
    dblink {
      table = "remoteweekly_positions"
    }
  }

  stack {
    db.add remoteweekly_positions {
      data = {created_at: "now"}
    } as $remoteweekly_positions
  }

  response = $remoteweekly_positions
}