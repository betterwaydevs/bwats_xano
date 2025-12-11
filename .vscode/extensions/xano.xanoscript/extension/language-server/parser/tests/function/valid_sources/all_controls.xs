function all_controls {
  input {
    int a?
  }

  stack {
    var $b {
      value = 12
    }
  
    group {
      stack {
        function.run add {
          input = {a: $input.a, b: $b}
          mock = {
            test1: 42
            test2: "hello"
          }
        } as $func1
      
        await {
          ids = []|push:$func1
          timeout = 10
        } as $x1
      }
    }
  
    conditional {
      if ($input.a == 12) {
        throw {
          name = "throw error"
          value = "oppsy"
        }
      }
    
      elseif ($input.a > 5)
      else {
        while (true == true) {
          each {
            switch ($input.a) {
              case (12) break
              case (24) {
                return {
                  value = 0
                }
              } break
            }
          }
        }
      }
    }
  
    foreach ([]|push:1|push:2|push:3|push:4) {
      each as $item {
        foreach.remove
        continue
      }
    }
  
    for (10) {
      each as $index {
        break
      }
    }
  }

  response = $x1
}