// Edit linkedin_applicants record
query "linkedin_applicants/{linkedin_applicants_id}" verb=PATCH {
  input {
    uuid linkedin_applicants_id?
    dblink {
      table = "linkedin_applicants"
    }
  }

  stack {
    db.edit linkedin_applicants {
      field_name = "id"
      field_value = $input.linkedin_applicants_id
      data = {}
    } as $linkedin_applicants
  }

  response = $linkedin_applicants
}