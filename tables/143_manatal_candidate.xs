// Stores candidate data imported from Manatal.
table manatal_candidate {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Unique identifier from Manatal for the candidate.
    int manatal_id?
  
    // The full name of the candidate.
    text full_name? filters=trim
  
    // The candidate's email address.
    email email? filters=trim|lower
  
    // URL to the candidate's resume.
    text resume? filters=trim
  
    // URL to the candidate's profile picture.
    text picture? filters=trim
  
    // The candidate's phone number.
    text phone_number? filters=trim
  
    // The candidate's current company.
    text current_company? filters=trim
  
    // The candidate's current position.
    text current_position? filters=trim
  
    // A brief description or summary of the candidate.
    text description? filters=trim
  
    // A unique hash associated with the candidate data.
    text hash? filters=trim
  
    // A JSON object containing custom fields for the candidate.
    json custom_fields?
  
    // Timestamp when the candidate record was last updated in Manatal.
    timestamp updated_at?
  
    // The candidate's gender.
    text gender? filters=trim
  
    // The candidate's address.
    text address? filters=trim
  
    // The candidate's latest reported degree.
    text latest_degree? filters=trim
  
    // The candidate's latest reported university.
    text latest_university? filters=trim
  
    // A JSON array of attachment details for the candidate.
    json attachments?
  
    // A JSON array of notes associated with the candidate.
    json notes?
  
    // A JSON array of education history records for the candidate.
    json educations?
  
    // A JSON array of work experience records for the candidate.
    json experiences?
  
    // A JSON array of social media links for the candidate.
    json social_media?
  
    // The uploaded resume file resource.
    attachment resume_file?
  
    image? candidate_image?
    text linkedin? filters=trim
  
    // The URL of the candidate's resume.
    text resume_url? filters=trim
  
    // The date the candidate data was parsed.
    date? parsed_date?
  
    text linked_recruit_profile_id? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree|unique"
      field: [{name: "manatal_id", op: "asc"}]
    }
    {type: "btree", field: [{name: "email", op: "asc"}]}
    {
      name : "location"
      lang : "english"
      type : "search"
      field: [{name: "address", op: "A"}]
    }
  ]
}