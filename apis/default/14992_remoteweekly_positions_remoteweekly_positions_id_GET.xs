// Get remoteweekly_positions record
query "remoteweekly_positions/{remoteweekly_positions_id}" verb=GET {
  api_group = "Default"

  input {
    int remoteweekly_positions_id? filters=min:1
  }

  stack {
    db.get remoteweekly_positions {
      field_name = "id"
      field_value = $input.remoteweekly_positions_id
    } as $remoteweekly_positions
  
    precondition ($remoteweekly_positions != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $remoteweekly_positions
}