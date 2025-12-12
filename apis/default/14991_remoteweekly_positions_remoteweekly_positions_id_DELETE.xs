// Delete remoteweekly_positions record.
query "remoteweekly_positions/{remoteweekly_positions_id}" verb=DELETE {
  api_group = "Default"

  input {
    int remoteweekly_positions_id? filters=min:1
  }

  stack {
    db.del remoteweekly_positions {
      field_name = "id"
      field_value = $input.remoteweekly_positions_id
    }
  }

  response = null
}