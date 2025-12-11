query all_basic_inputs verb=GET {
  input {
    text text_input? filters=trim
    int int_input?
    uuid ?uuid_input?
    object object_input? {
      schema {
        text text_input? filters=trim
      }
    }
  
    int availability_id? filters=@:dbo=36
    vector ?vector_input?
    enum enum_input? {
      values = ["true", "false"]
    }
  
    timestamp ?timestamp_input?
    date ?date_input?
    bool boolean_input?
    decimal decimal_input?
    email email_input? filters=trim|lower
    password password_input? {
      sensitive = true
    }
  
    json json_input?
  }

  stack
  response = null
}