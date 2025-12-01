// Stores data parsed from candidate resumes or profiles.
table parsed_candidate {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // The public-facing name of the candidate.
    text public_name? filters=trim
  
    // The candidate's first name.
    text first_name? filters=trim
  
    // The candidate's last name.
    text last_name? filters=trim
  
    // The candidate's city.
    text city? filters=trim
  
    // The candidate's country.
    text country? filters=trim
  
    // A JSON array of languages spoken by the candidate with proficiency levels.
    json languages?
  
    // Total years of experience.
    decimal total_experience_years?
  
    // A short description of the candidate's primary role.
    text short_role? filters=trim
  
    // A headline description of the candidate's role.
    text headline_role? filters=trim
  
    // A summary of the candidate's role.
    text role_summary? filters=trim
  
    // A summary of the candidate's technical skills.
    text technical_summary? filters=trim
  
    // The candidate's salary aspiration in USD.
    decimal salary_aspiration?
  
    // The candidate's current employment status.
    text employment_status? filters=trim
  
    // A JSON array of technical skills with experience details.
    json skills?
  
    // A JSON array detailing the candidate's work history.
    json work_history?
  
    // A JSON array detailing the candidate's education history.
    json education?
  
    // A JSON array of certifications held by the candidate.
    json certifications?
  
    // The candidate's email address.
    email email? filters=trim|lower
  
    // The candidate's phone number.
    text phone_number? filters=trim
  
    // URL to the candidate's LinkedIn profile.
    text linkedin_profile? filters=trim
  
    // URL to the candidate's GitHub profile.
    text github_profile? filters=trim
  
    // The candidate's availability status.
    text availability? filters=trim
  
    // The last modified date of the resume (YYYY-MM format).
    text resume_last_modified? filters=trim
  
    // The last updated date of the profile (YYYY-MM format).
    text profile_last_updated? filters=trim
  
    // A JSON array of industries the candidate has experience in.
    json industries?
  
    // Unique identifier from Manatal for the linked candidate record.
    int manatal_id?
  
    // URL to the candidate's profile picture.
    text picture? filters=trim
  
    // The ID of the resume file uploaded to OpenAI.
    text openai_file_id? filters=trim
  
    // The document ID from Elastic Search.
    text elastic_search_document_id? filters=trim
  
    // A standardized date associated with the parsed data, intended to default to Jan 1, 2025.
    date normalized_date?="2025-01-01"
  
    // The creation or update date of the Elastic Search document.
    date es_created_updated_date?="2025-01-01"
  
    text linked_recruit_profile_id? filters=trim
    text old_system_notes? filters=trim
    text general_notes? filters=trim
  
    // HTML of the profile to parse.
    text linked_html? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {type: "btree", field: [{name: "manatal_id", op: "asc"}]}
    {type: "btree", field: [{name: "email", op: "asc"}]}
    {
      type : "btree"
      field: [{name: "linkedin_profile", op: "asc"}]
    }
    {
      type : "btree"
      field: [{name: "city", op: "asc"}, {name: "country", op: "asc"}]
    }
    {
      lang : "english"
      type : "search"
      field: [{name: "public_name", op: "A"}]
    }
    {
      lang : "english"
      type : "search"
      field: [{name: "short_role", op: "A"}]
    }
    {type: "btree", field: [{name: "github_profile", op: "asc"}]}
    {
      type : "btree"
      field: [{name: "normalized_date", op: "asc"}]
    }
    {type: "btree", field: [{name: "openai_file_id", op: "asc"}]}
    {
      type : "btree"
      field: [{name: "elastic_search_document_id", op: "asc"}]
    }
    {
      type : "btree"
      field: [{name: "es_created_updated_date", op: "asc"}]
    }
    {
      type : "btree|unique"
      field: [{name: "elastic_search_document_id", op: "asc"}]
    }
    {
      type : "btree"
      field: [{name: "linked_recruit_profile_id", op: "asc"}]
    }
  ]
}