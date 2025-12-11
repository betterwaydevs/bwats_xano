# Candidate lifecycle end-to-end validation
#
# This test follows docs/candidate_lifecycle_spec.md and adds an extra
# validation to ensure the candidate association is persisted.

POST https://xano.atlanticsoft.co/api:Ks58d17q:development/auth/login?x-data-source=development
Content-Type: application/json

{
  "email": "{{TEST_USER_EMAIL}}",
  "password": "{{TEST_USER_PASSWORD}}"
}

HTTP 200
[Captures]
token: jsonpath "$.authToken"
[Asserts]
jsonpath "$.authToken" exists

POST https://xano.atlanticsoft.co/api:wosIWFpR:development/parsed_candidate?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "first_name": "Test",
  "last_name": "Candidate",
  "email": "test.candidate+{{TEST_RUN_SUFFIX}}@example.com",
  "phone_number": "+1234567890",
  "city": "Test City",
  "country": "Test Country",
  "short_role": "Tester",
  "linkedin_profile": "https://linkedin.com/in/test-candidate-{{TEST_RUN_SUFFIX}}",
  "elastic_search_document_id": "candidate-es-{{TEST_RUN_SUFFIX}}"
}

HTTP 200
[Captures]
candidate_id: jsonpath "$.id"
[Asserts]
jsonpath "$.id" exists

GET https://xano.atlanticsoft.co/api:wosIWFpR:development/parsed_candidate/{{candidate_id}}?x-data-source=development
Authorization: Bearer {{token}}

HTTP 200
[Asserts]
jsonpath "$.id" == {{candidate_id}}
jsonpath "$.email" == "test.candidate+{{TEST_RUN_SUFFIX}}@example.com"

GET https://xano.atlanticsoft.co/api:_dY_2A8p:development/association/person/candidate/{{candidate_id}}?x-data-source=development
Authorization: Bearer {{token}}

HTTP 200
[Asserts]
jsonpath "$[?(@.person_id=={{candidate_id}})]" count == 1

DELETE https://xano.atlanticsoft.co/api:wosIWFpR:development/candidates/{{candidate_id}}?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "parsed_candidate_id": {{candidate_id}}
}

HTTP 200

GET https://xano.atlanticsoft.co/api:wosIWFpR:development/parsed_candidate/{{candidate_id}}?x-data-source=development
Authorization: Bearer {{token}}

HTTP 404
[Asserts]
jsonpath "$.code" == "ERROR_CODE_NOT_FOUND"

GET https://xano.atlanticsoft.co/api:_dY_2A8p:development/association/person/candidate/{{candidate_id}}?x-data-source=development
Authorization: Bearer {{token}}

HTTP/1.1 200
[Asserts]
jsonpath "$[*]" count == 0
