function "ledash/ends_with" {
  description = """
    Checks if `string` (or `array`) ends with the given `target` string (or `array`).
    
    ## Example
    
    ```
    {
      "text": "some string",
      "target": "ing"
    }
    ```
    
    returns 
    ```
    true
    ```
    """

  input {
    json text?
    json target?
    int position?=-1
  }

  stack {
    var $text {
      description = "Working copy of the input text for processing"
      value = $input.text
    }
  
    var $target {
      description = "Working copy of the target value for processing"
      value = $input.target
    }
  
    conditional {
      description = "Convert any string into an array of characters"
    
      if (($input.text|is_text) === true) {
        var.update $text {
          value = $text|split:""
        }
      }
    }
  
    conditional {
      description = "Convert any string into an array of characters"
    
      if (($target|is_text) === true) {
        var.update $target {
          value = $target|split:""
        }
      }
    }
  
    conditional {
      description = "If we still have a single value, make it an array with a single element"
    
      if (($target|is_array) !== true) {
        var.update $target {
          value = []|push:$target
        }
      }
    }
  
    var $position {
      description = "Calculate the final position to check based on input or text length"
      value = $input.position > -1 ? $input.position : ($text|count)
    }
  
    for ($target|count) {
      description = "Now we should only have arrays in target and text variables"
    
      each as $index {
        conditional {
          description = "compare every element using position as an offset on the string"
        
          if (($text|get:$position - $index - 1:null) !== ($target|get:($target|count) - $index - 1:null)) {
            return {
              value = false
            }
          }
        }
      }
    }
  }

  response = true
}