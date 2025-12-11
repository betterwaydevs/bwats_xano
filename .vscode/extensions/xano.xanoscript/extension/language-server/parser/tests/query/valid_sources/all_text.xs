query text verb=GET {
  input
  stack {
    var $x1 {
      value = "Hello World"
    }
  
    text.append $x1 {
      value = "Namaste"
    }
  
    text.contains $x1 {
      value = "Hello"
    } as $x2
  
    text.ends_with $x1 {
      value = "World"
    } as $x3
  
    text.icontains $x1 {
      value = "hello"
    } as $x4
  
    text.iends_with $x1 {
      value = "WORLD"
    } as $x5
  
    text.istarts_with $x1 {
      value = "HELLO"
    } as $x6
  
    text.ltrim $x1 {
      value = ""
    }
  
    text.prepend $x1 {
      value = "Hi"
    }
  
    text.rtrim $x1 {
      value = ""
    }
  
    text.starts_with $x1 {
      value = "THE"
    } as $x7
  
    text.trim $x1 {
      value = ""
    }
  }

  response = $x1
}