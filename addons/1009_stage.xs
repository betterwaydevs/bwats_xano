addon stage {
  input {
    int stage_id? {
      table = "stage"
    }
  }

  stack {
    db.query stage {
      where = $db.stage.id == $input.stage_id
      return = {type: "single"}
    }
  }
}