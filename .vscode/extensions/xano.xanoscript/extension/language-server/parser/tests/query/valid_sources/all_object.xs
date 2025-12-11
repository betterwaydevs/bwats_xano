query all_object verb=GET {
  input
  stack {
    var $my_obj {
      value = { foo: "bar"}
    }
  
    object.entries {
      value = $my_obj
    } as $entries
  
    object.keys {
      value = $my_obj
    } as $keys
  
    object.values {
      value = $my_obj
    } as $values
  }

  response = {
    keys: $keys, 
    entries: $entries
  }
}