query check_linked_network verb=POST {
  api_group = "linkedin"

  input {
    text[] linkedin_connections? filters=trim
  }

  stack {
    var $response {
      value = ""
    }
  
    api.lambda {
      code = """
        if (!Array.isArray($input.linkedin_connections)) {
          throw new Error("Input 'linkedin_connections' must be an array.");
        }
        
        const replacedConnections = $input.linkedin_connections.reduce((accumulator, currentString) => {
          if (typeof currentString !== 'string') {
            return accumulator;
          }
        
          const encodedString = encodeURI(currentString);
        
          if (encodedString !== currentString) {
            accumulator.push(encodedString);
          }
        
          return accumulator;
        }, []);
        
        return replacedConnections;
        """
      timeout = 10
    } as $encoded_profiles
  
    db.query linkedin_connections {
      where = $db.linkedin_connections.Connection_Profile_URL in $input.linkedin_connections || $db.linkedin_connections.Connection_Profile_URL in $encoded_profiles
      return = {type: "list"}
      addon = [
        {
          name  : "user"
          output: ["name"]
          input : {user_id: $output.user_id}
          as    : "_user"
        }
      ]
    } as $connections
  
    db.query linkedin_invitation {
      where = $db.linkedin_invitation.Connection_Profile_URL in $input.linkedin_connections || $db.linkedin_invitation.Connection_Profile_URL in $encoded_profiles
      return = {type: "list"}
      addon = [
        {
          name  : "user"
          output: ["name"]
          input : {user_id: $output.user_id}
          as    : "_user"
        }
      ]
    } as $linkedin_invitation
  
    var.update $response.connections {
      value = $connections
    }
  
    var.update $response.invitations {
      value = $linkedin_invitation
    }
  }

  response = $response
}