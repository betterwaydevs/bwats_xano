// Edit remoteweekly_positions record
query "remoteweekly_positions/{remoteweekly_positions_id}" verb=PATCH {
  api_group = "Default"

  input {
    int remoteweekly_positions_id? filters=min:1
    dblink {
      table = "remoteweekly_positions"
    }
  }

  stack {
    db.edit remoteweekly_positions {
      field_name = "id"
      field_value = $input.remoteweekly_positions_id
      data = {}
    } as $remoteweekly_positions
  }

  response = $remoteweekly_positions
}