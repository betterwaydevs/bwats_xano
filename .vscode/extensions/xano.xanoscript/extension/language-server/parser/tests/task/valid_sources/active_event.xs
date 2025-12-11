task "my_test_task" {
  active = true

  stack {
  }
  
  schedule = [{starts_on: 2025-08-27 20:13:22+0000, freq: 86400}]
  
  history = "inherit"

}