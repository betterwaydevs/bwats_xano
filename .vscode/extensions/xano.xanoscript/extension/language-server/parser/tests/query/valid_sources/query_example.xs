query "auth/sign8up/now" verb=POST {
  description = "Signup and retrieve an authentication token"
  input {
    text name?
    email email?
    text password?
  }

  stack {
    db.get "email table" {
      field_name = "email"
      field_value = $input.email
    } as $user
  
    precondition ($user == null) {
      error_type = "accessdenied"
      error = "This account is already in use."
    }
  
    db.add "my table" {
      data = {
        created_at: '"now"'
        name      : "$input.name"
        email     : "$input.email"
        password  : "$input.password"
        larget_text: """
          This is a large text field
          that spans multiple lines.
          """
        test: "foo"
      }
    } as $user
  
    security.create_auth_token {
      table = "34"
      extras = []
      expiration = 86400
      id = $user.id
    } as $authToken
  }

  response = {authToken: $authToken}
}