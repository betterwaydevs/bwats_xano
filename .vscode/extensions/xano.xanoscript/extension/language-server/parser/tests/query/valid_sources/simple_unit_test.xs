query test_expect verb=GET {
  input {
    int a
    int b
  }

  stack {
    var $sum {
      value = $input.a
    }
    math.add $sum {
      value = $input.b
    } 
  }

  response = $sum

  test "should add two numbers" {
    input = {a: 20, b: 22}

    expect.to_equal ($response) {
      value = 42
    }
  }

  test "another test with input" {
    input = {a: 20, b: 22}

    expect.to_be_greater_than ($response) {
      value = 40
    }
  }
}