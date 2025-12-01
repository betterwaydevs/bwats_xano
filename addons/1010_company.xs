addon company {
  input {
    int company_id? {
      table = "company"
    }
  }

  stack {
    db.query company {
      where = $db.company.id == $input.company_id
      return = {type: "single"}
    }
  }
}