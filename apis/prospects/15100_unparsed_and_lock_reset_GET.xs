// Resets the parse_status of prospects from 'parsing' to 'pending'.
query unparsed_and_lock_reset verb=GET {
  api_group = "prospects"

  input {
  }

  stack {
    // Find all prospects currently stuck in the 'parsing' state.
    db.query parsed_prospect {
      where = $db.parsed_prospect.parse_status == "parsing"
      return = {type: "list"}
    } as $parsing_prospects
  
    // Loop through each of the identified prospects.
    foreach ($parsing_prospects) {
      each as $prospect {
        // Update the status of each prospect back to 'pending'.
        db.edit parsed_prospect {
          field_name = "id"
          field_value = $prospect.id
          data = {parse_status: "pending"}
        }
      }
    }
  
    // Get the total count of prospects that were updated.
    var $updated_count {
      value = $parsing_prospects|count
    }
  }

  response = {
    success      : true
    message      : "Successfully reset " ~ $updated_count ~ " prospects from 'parsing' to 'pending'."
    updated_count: $updated_count
  }
}