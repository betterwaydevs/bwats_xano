// Edit parsed_prospect record
query "temp_n8n_parsed_prospect/{parsed_prospect_id}" verb=PATCH {
  api_group = "prospects"

  input {
    int parsed_prospect_id? filters=min:1
    dblink {
      table = "parsed_prospect"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    var $payload {
      value = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    }
  
    var $should_normalize {
      value = ((($raw_input|keys)|intersect:["skills"])|count) > 0
    }
  
    db.patch parsed_prospect {
      field_name = "id"
      field_value = $input.parsed_prospect_id
      data = $payload
    } as $model
  
    conditional {
      if ($should_normalize) {
        function.run prospect_quick_normalize_skills {
          input = {prospect_id: $input.parsed_prospect_id}
        } as $normalization
      }
    }
  }

  response = $model
}