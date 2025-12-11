table book_club_meeting_registration {
  auth = false
  schema {
    int id {
      description = "Unique identifier for the registration"
    }
  
    int meeting_id {
      description = "ID of the book club meeting"
    }
  
    int member_id {
      description = "ID of the book club member"
    }
  
    timestamp registered_at?=now {
      description = "Timestamp when the registration was created"
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {
      type : "btree"
      field: [
        {name: "meeting_id", op: "asc"}
        {name: "member_id", op: "asc"}
      ]
    }
  ]

}