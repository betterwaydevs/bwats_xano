function multiline {
  input {
    int score?
  }

  stack {
    conditional {
      if (
        (```
        $input.score
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        ```) == (```
        $input.score
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        |is_empty
        ```)
        ) {
        var $x1 {
          value = 123
        }
      }
    }
  }

  response = $x1
}