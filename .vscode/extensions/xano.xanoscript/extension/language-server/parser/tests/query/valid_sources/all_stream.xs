query stream verb=GET {
  input
  stack {
    group {
      stack {
        storage.create_file_resource {
          filename = "addr.csv"
          filedata = """
            Name,Age,City
            Alice,30,Sydney
            Bob,25,Granville
            Charlie,35,Melbourne
            Diana,28,Brisbane
            """
        } as $my_file
      
        stream.from_csv {
          value = $file
          separator = ","
          enclosure = "'"
          escape_char = "'"
        } as $stream_1
      
        var $csv_records {
          value = []
        }
      
        foreach ($stream_1) {
          each as $item {
            var.update $csv_records {
              value = $csv_records|push:$item
            }
          }
        }
      }
    }
  
    storage.create_file_resource {
      filename = "test.jsonl"
      filedata = """
        {"name": "Alice Smith", "age": 30, "address": {"street": "123 Main St", "city": "Granville", "state": "NSW", "zip": "2142"}, "hobbies": ["reading", "hiking", "painting"]} 
        {"name": "Bob Johnson", "age": 25, "address": {"street": "456 Oak Ave", "city": "Sydney", "state": "NSW", "zip": "2000"}, "hobbies": ["gaming", "coding", "swimming"]} 
        {"name": "Charlie Brown", "age": 35, "address": {"street": "789 Pine Ln", "city": "Melbourne", "state": "VIC", "zip": "3000"}, "hobbies": ["cooking", "traveling", "photography"]}
        """
    } as $file_data_content
  
    var $jsonl_lines {
      value = []
    }
  
    stream.from_jsonl {
      value = $jsonl_file_resource
    } as $stream1
  
    foreach ($stream1) {
      each as $item {
        var.update $jsonl_lines {
          value = $jsonl_lines|push:$item
        }
      }
    }
  }

  response = {
    jsonl_lines: $jsonl_lines, 
    csv_records: $csv_records
  }
  
}