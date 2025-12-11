query array verb=GET {
  input
  stack {
    array.find ([]|push:1|push:2|push:3) if ($this == 1) as $x1
    var $my_array {
      value = !text "[\n  1,\n  2,\n  3,\n  4,\n  5,\n  6,\n  6\n]"|json_decode
    }
  
    array.push $my_array {
      value = 1
      disabled = true
      description = "Some description"
    }
  
    array.unshift $my_array {
      value = $x1
    }
  
    array.shift $my_array as $removed
    array.pop $my_array as $popped
    array.merge $my_array {
      value = $removed
    }
  
    array.find_index ($my_array|push:1) if ($this == 2) as $x2
    array.has ($my_array) if ($this == 3) as $x3
    array.every ([]|push:2) if ($this|istarts_with:"foo" == true) as $x4
    array.filter ($x1) if ($this == 2) as $x5
    array.filter_count ($x1) if ($this > 2) as $x6
  }

  response = $x1
}