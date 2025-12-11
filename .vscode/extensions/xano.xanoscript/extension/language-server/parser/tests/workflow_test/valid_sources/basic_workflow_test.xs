workflow_test new_test {
  stack {
    function.call add {
      input = {a: 5, b: 10}
    } as $sum
  
    expect.to_equal ($sum) {
      value = 15
    }
  
    task.call "count to 10" as $test1
  }
}