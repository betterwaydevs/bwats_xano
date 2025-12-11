query all_math verb=GET {
  input {
  }

  stack {
    var $x1 {
      value = 7425
    }
  
    var $x2 {
      value = { "a": 12, "b": 2}
    }
  
    math.add $x2.a {
      value = 1
    }
  
    math.sub $x1 {
      value = 1
    }
  
    math.mul $x1 {
      value = 5
    }
  
    math.div $x1 {
      value = 2
    }
  
    math.mod $x1 {
      value = 123
    }
  
    math.bitwise.and $x1 {
      value = 112
    }
  
    math.bitwise.or $x1 {
      value = $x1
    }
  
    math.bitwise.xor $x1 {
      value = 110
    }
  
    db.get array_columns {
      field_name = "id"
      field_value = 1
    } as $array_columns1
  }

  response = {result1: $x1, x2: $x2}
}