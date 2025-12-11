// Query all remoteweekly_positions records
query remoteweekly_positions verb=GET {
  input {
  }

  stack {
    db.query remoteweekly_positions {
      return = {type: "list"}
    } as $remoteweekly_positions
  }

  response = $remoteweekly_positions
}