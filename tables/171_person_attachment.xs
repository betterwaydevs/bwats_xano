// Stores attachments for individuals (candidates or prospects) such as resumes and other documents.
table person_attachment {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // The ID of the associated person (either a parsed_candidate or parsed_prospect).
    int person_id?
  
    // Indicates if the person is a 'prospect' or 'candidate'.
    enum person_type? {
      values = ["prospect", "candidate"]
    }
  
    // The actual attachment file (e.g., resume PDF).
    attachment attachment?
  
    // The type of file, categorizing the attachment.
    enum file_type? {
      values = ["resume", "other"]
    }
  
    text openia_file_id? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree"
      field: [
        {name: "person_id", op: "asc"}
        {name: "person_type", op: "asc"}
      ]
    }
    {type: "btree", field: [{name: "file_type", op: "asc"}]}
  ]
}