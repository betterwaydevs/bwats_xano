query "api/2" verb=GET {
  input {
  }

  stack {
    var $x1 {
      value = "test1"
    }
  }

  response = $x1

  test "test/api/1" {
    expect.to_equal ($response) {
      value = "test1"
    }
  
    expect.to_not_equal ($response) {
      value = "rwar"
    }
  }
}