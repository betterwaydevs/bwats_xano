// Stores parsed prospect data, linked to a parsed candidate.
table parsed_prospect {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // URL to the prospect's LinkedIn profile.
    text linkedin_profile? filters=trim
  
    // An external unique identifier for the linked recruit profile.
    text linked_recruit_profile_id? filters=trim
  
    // HTML of the profile to parse
    text linked_html? filters=trim
  
    enum parse_status?=pending {
      values = ["pending", "parsed", "failed", "parsing", "conflict"]
    }
  
    // The public-facing name of the prospect.
    text public_name? filters=trim
  
    // The prospect's first name.
    text first_name? filters=trim
  
    // The prospect's last name.
    text last_name? filters=trim
  
    // The prospect's city.
    text city? filters=trim
  
    // The prospect's country.
    text country? filters=trim
  
    // A JSON array of languages spoken by the prospect with proficiency levels.
    json languages?
  
    // Total years of experience.
    decimal total_experience_years?
  
    // A short description of the prospect's primary role.
    text short_role? filters=trim
  
    // A headline description of the prospect's role.
    text headline_role? filters=trim
  
    // A summary of the prospect's role.
    text role_summary? filters=trim
  
    // A summary of the prospect's technical skills.
    text technical_summary? filters=trim
  
    // The prospect's salary aspiration in USD.
    decimal salary_aspiration?
  
    // URL to the prospect's GitHub profile.
    text github_profile? filters=trim
  
    // The prospect's current employment status.
    text employment_status? filters=trim
  
    // A JSON array of technical skills with experience details.
    json skills?
  
    // A JSON array detailing the prospect's work history.
    json work_history?
  
    // A JSON array detailing the prospect's education history.
    json education?
  
    // A JSON array of certifications held by the prospect.
    json certifications?
  
    // The prospect's email address.
    text email?
  
    // The prospect's phone number.
    text phone_number? filters=trim
  
    // The prospect's availability status.
    text availability? filters=trim
  
    // The last modified date of the resume (YYYY-MM format).
    text resume_last_modified? filters=trim
  
    // The last updated date of the profile (YYYY-MM format).
    text profile_last_updated? filters=trim
  
    // A JSON array of industries the prospect has experience in.
    json industries?
  
    // URL to the prospect's profile picture.
    text picture? filters=trim
  
    // The ID of the resume file uploaded to OpenAI.
    text openai_file_id? filters=trim
  
    // The document ID from Elastic Search.
    text elastic_search_document_id? filters=trim
  
    // A standardized date associated with the parsed data, intended to default to Jan 1, 2025.
    date normalized_date?
  
    // The creation or update date of the Elastic Search document.
    date es_created_updated_date?
  
    text general_notes? filters=trim
    int manatal_id?
    text old_system_notes? filters=trim
    bool is_quick_normalized?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree|unique"
      field: [{name: "linked_recruit_profile_id", op: "asc"}]
    }
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
    {
      type : "btree"
      field: [{name: "elastic_search_document_id", op: "asc"}]
    }
    {
      type : "btree"
      field: [{name: "normalized_date", op: "asc"}]
    }
    {
      type : "btree"
      field: [{name: "es_created_updated_date", op: "asc"}]
    }
    {type: "btree", field: [{name: "parse_status", op: "asc"}]}
    {
      type : "btree"
      field: [{name: "is_quick_normalized", op: "asc"}]
    }
    {
      type : "btree"
      field: [{name: "is_quick_normalized", op: "desc"}]
    }
    {type: "btree", field: [{name: "country", op: "desc"}]}
  ]
}