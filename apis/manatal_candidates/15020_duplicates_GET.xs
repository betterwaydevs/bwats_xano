query duplicates verb=GET {
  api_group = "manatal_candidates"

  input {
  }

  stack {
    db.direct_query {
      sql = "WITH DupEmails AS (SELECT email FROM x6_143 manatal_candidate WHERE email IS NOT NULL AND email <> '' GROUP BY email HAVING COUNT(*) > 1), DupLinkedins AS (SELECT linkedin FROM x6_143 manatal_candidate WHERE linkedin IS NOT NULL AND linkedin <> '' AND linkedin NOT IN ('linked', 'Linkedin') GROUP BY linkedin HAVING COUNT(*) > 1), DupPhones AS (SELECT phone_number FROM x6_143 manatal_candidate WHERE phone_number IS NOT NULL AND phone_number <> '' GROUP BY phone_number HAVING COUNT(*) > 1) SELECT mc.id, mc.created_at, mc.manatal_id, mc.full_name, mc.email, mc.picture, mc.phone_number, mc.current_company, mc.current_position, mc.description, mc.hash, mc.custom_fields, mc.updated_at, mc.gender, mc.address, mc.latest_degree, mc.latest_university, mc.notes, mc.candidate_image, mc.linkedin FROM x6_143 mc JOIN DupEmails de ON mc.email = de.email UNION SELECT mc.id, mc.created_at, mc.manatal_id, mc.full_name, mc.email, mc.picture, mc.phone_number, mc.current_company, mc.current_position, mc.description, mc.hash, mc.custom_fields, mc.updated_at, mc.gender, mc.address, mc.latest_degree, mc.latest_university, mc.notes, mc.candidate_image, mc.linkedin FROM x6_143 mc JOIN DupLinkedins dl ON mc.linkedin = dl.linkedin UNION SELECT mc.id, mc.created_at, mc.manatal_id, mc.full_name, mc.email, mc.picture, mc.phone_number, mc.current_company, mc.current_position, mc.description, mc.hash, mc.custom_fields, mc.updated_at, mc.gender, mc.address, mc.latest_degree, mc.latest_university, mc.notes, mc.candidate_image, mc.linkedin FROM x6_143 mc JOIN DupPhones dp ON mc.phone_number = dp.phone_number ORDER BY linkedin;"
      response_type = "list"
    } as $x1
  }

  response = $x1
}