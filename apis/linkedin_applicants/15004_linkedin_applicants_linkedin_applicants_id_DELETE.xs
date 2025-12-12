// Delete linkedin_applicants record.
query "linkedin_applicants/{linkedin_applicants_id}" verb=DELETE {
  api_group = "linkedin_applicants"

  input {
    uuid linkedin_applicants_id?
  }

  stack {
    db.del linkedin_applicants {
      field_name = "id"
      field_value = $input.linkedin_applicants_id
    }
  }

  response = null
}