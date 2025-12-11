query get_auth verb=GET {
  input
  stack {
    var authToken {
      value = "foo-bar"
    }
  
    util.set_header {
      value = "Set-Cookie: sessionId=your-session-id; HttpOnly; Secure; SameSite=None; Max-Age=3600"|string_replace:"your-session-id":$authToken
      duplicates = "replace"
    }
  }

  response = $authToken
}