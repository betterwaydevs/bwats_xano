// Stores data for LinkedIn connection invitations sent by users.
table linkedin_invitation {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Foreign key to the user who sent the invitation.
    int user_id? {
      table = "user"
    }
  
    // The first name of the person who received the invitation.
    text First_Name? filters=trim
  
    // The last name of the person who received the invitation.
    text Last_Name? filters=trim
  
    // The LinkedIn profile URL of the person who received the invitation.
    text Connection_Profile_URL? filters=trim
  
    // The message sent with the invitation.
    text Message? filters=trim
  
    // The date the LinkedIn invitation was sent.
    date Invited_On?=now
  
    // The position of the person who received the invitation.
    text Position? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree"
      field: [{name: "Connection_Profile_URL", op: "asc"}]
    }
    {
      type : "btree|unique"
      field: [
        {name: "user_id", op: "asc"}
        {name: "Connection_Profile_URL", op: "asc"}
      ]
    }
  ]
}