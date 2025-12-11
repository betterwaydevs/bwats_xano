function "data/filter_by_value" {
  description = "Selects rows based on a specific value in a chosen column."
  input {
    json data {
      description = "The dataset (e.g., a list of lists or a similar tabular structure)."
    }
  
    int column_index {
      description = "The zero-based index of the column to filter on."
    }
  
    text filter_value {
      description = "The value to match within the specified column."
    }
  }

  stack {
    var $filtered_data {
      value = []
      description = "Initialize an empty array to store filtered rows."
    }
  
    precondition (($input.data|is_array) && (($input.data|count) > 0)) {
      error_type = "inputerror"
      error = "Invalid data input. Expected a non-empty array."
      description = "Validate that the data input is a non-empty array."
    }
  
    precondition (($input.column_index >= 0) && ($input.column_index < ($input.data|first|count))) {
      error_type = "inputerror"
      error = "Invalid column index. Index out of bounds."
      description = "Validate that the column index is within the bounds of the data."
    }
  
    foreach ($input.data) {
      each as $row {
        var $column_value {
          value = $row[$input.column_index]
          description = "Get the value from the specified column index in the current row."
        }
      
        conditional {
          if ($column_value == $input.filter_value) {
            var.update $filtered_data {
              value = $filtered_data|append:$row
              description = "Append the row to filtered_data if the column value matches the filter value."
            }
          }
        }
      }
    }
  }

  response = $filtered_data
}