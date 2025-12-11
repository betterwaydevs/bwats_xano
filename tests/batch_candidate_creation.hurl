# Batch Candidate Creation – Spec Compliance Test

# 1) Authenticate and capture auth token as well as a unique suffix.
POST https://xano.atlanticsoft.co/api:Ks58d17q:development/auth/login?x-data-source=development
Content-Type: application/json

{
  "email": "{{TEST_USER_EMAIL}}",
  "password": "{{TEST_USER_PASSWORD}}"
}

HTTP 200
[Captures]
token: jsonpath "$.authToken"
run_suffix: header "x-trace-id"

# 3) Create an “existing” candidate used later for assignment validation.
POST https://xano.atlanticsoft.co/api:wosIWFpR:development/parsed_candidate?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "first_name": "Existing",
  "last_name": "BatchUser",
  "email": "existing.batch.{{run_suffix}}@example.com",
  "city": "Test City",
  "country": "Test Country",
  "short_role": "Tester",
  "linkedin_profile": "https://linkedin.com/in/existing-batch-{{run_suffix}}",
  "elastic_search_document_id": "existing-batch-es-{{run_suffix}}"
}

HTTP 200
[Captures]
existing_candidate_id: jsonpath "$.id"

# --- Scenario 1: Mixed batch (new, existing, invalid) ---
POST https://xano.atlanticsoft.co/api:wosIWFpR:development/candidate/quick_create_batch?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "project_id": 7,
  "stage_id": 288,
  "candidates": [
    {
      "linkedin_profile": "https://linkedin.com/in/new-batch-{{run_suffix}}",
      "first_name": "New",
      "last_name": "Candidate",
      "email": "new.batch.{{run_suffix}}@example.com"
    },
    {
      "linkedin_profile": "https://linkedin.com/in/existing-batch-{{run_suffix}}",
      "first_name": "Existing",
      "last_name": "BatchUser",
      "email": "existing.batch.{{run_suffix}}@example.com"
    },
    {
      "linkedin_profile": "bad-url",
      "first_name": "Invalid",
      "last_name": "User"
    }
  ]
}

HTTP 200
[Captures]
created_candidate_id: jsonpath "$.results[?(@.status=='created')].candidate_id"
created_association_id: jsonpath "$.results[?(@.status=='created')].association_id"
assigned_association_id: jsonpath "$.results[?(@.status=='assigned')].association_id"
[Asserts]
jsonpath "$.total_processed" == 3
jsonpath "$.created_count" == 1
jsonpath "$.assigned_count" == 1
jsonpath "$.failed_count" == 1
jsonpath "$.results[?(@.status=='created')].linkedin_profile" nth 0 == "https://linkedin.com/in/new-batch-{{run_suffix}}"
jsonpath "$.results[?(@.status=='assigned')].linkedin_profile" nth 0 == "https://linkedin.com/in/existing-batch-{{run_suffix}}"
jsonpath "$.results[?(@.status=='failed')].error" nth 0 contains "LinkedIn"

# --- Scenario 2: Empty batch should be a no-op ---
POST https://xano.atlanticsoft.co/api:wosIWFpR:development/candidate/quick_create_batch?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "project_id": 7,
  "stage_id": 288,
  "candidates": []
}

HTTP 200
[Asserts]
jsonpath "$.total_processed" == 0
jsonpath "$.created_count" == 0
jsonpath "$.assigned_count" == 0
jsonpath "$.failed_count" == 0
jsonpath "$.results" count == 0

# --- Scenario 3: Missing required fields should fail entry, not batch ---
POST https://xano.atlanticsoft.co/api:wosIWFpR:development/candidate/quick_create_batch?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "project_id": 7,
  "stage_id": 288,
  "candidates": [
    {
      "linkedin_profile": "https://linkedin.com/in/missing-first-name-{{run_suffix}}",
      "last_name": "User"
    }
  ]
}

HTTP 200
[Asserts]
jsonpath "$.total_processed" == 1
jsonpath "$.failed_count" == 1
jsonpath "$.results[0].status" == "failed"
jsonpath "$.results[0].error" contains "first_name"

# --- Scenario 4: Invalid project should fail during pre-flight ---
POST https://xano.atlanticsoft.co/api:wosIWFpR:development/candidate/quick_create_batch?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "project_id": 999999,
  "stage_id": 288,
  "candidates": [
    {
      "linkedin_profile": "https://linkedin.com/in/preflight-fail-{{run_suffix}}",
      "first_name": "Fail",
      "last_name": "Fast"
    }
  ]
}

HTTP 404

# --- Cleanup: remove associations and candidates created during the test ---
# Delete association created for the new candidate.
GET https://xano.atlanticsoft.co/api:_dY_2A8p:development/association/person/candidate/{{created_candidate_id}}?x-data-source=development
Authorization: Bearer {{token}}

HTTP 200
[Captures]
created_association_id_cleanup: jsonpath "$[0].id"

DELETE https://xano.atlanticsoft.co/api:_dY_2A8p:development/association/{{created_association_id_cleanup}}?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "project_person_association_id": {{created_association_id_cleanup}}
}

HTTP 200

# Delete association for the existing candidate that was assigned from the batch.
GET https://xano.atlanticsoft.co/api:_dY_2A8p:development/association/person/candidate/{{existing_candidate_id}}?x-data-source=development
Authorization: Bearer {{token}}

HTTP 200
[Captures]
existing_association_id_cleanup: jsonpath "$[0].id"

DELETE https://xano.atlanticsoft.co/api:_dY_2A8p:development/association/{{existing_association_id_cleanup}}?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "project_person_association_id": {{existing_association_id_cleanup}}
}

HTTP 200

# Finally, delete the candidates created explicitly within the test.
DELETE https://xano.atlanticsoft.co/api:wosIWFpR:development/candidates/{{created_candidate_id}}?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "parsed_candidate_id": {{created_candidate_id}}
}

HTTP 200

DELETE https://xano.atlanticsoft.co/api:wosIWFpR:development/candidates/{{existing_candidate_id}}?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "parsed_candidate_id": {{existing_candidate_id}}
}

HTTP 200
