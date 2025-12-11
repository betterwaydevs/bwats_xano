query "IMPORTLEADS/BATCH" verb=POST {
  input {
  }

  stack {
    function.run IMPORTLEADS_BATCH as $func_1
  }

  response = $func_1
}