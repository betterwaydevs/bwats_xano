query query_0 verb=GET {
  input {
    // new name comment
    text name?
  
    // new desc
    int integer?
  }

  stack {
    // new x1 comment
  
    var $x1 {
      value = "test1ahe"
    }
  
    // test1
  
    var $x2 {
      value = $input.name
    }
  }

  response = {
    !result1: $x1, 
  }
}