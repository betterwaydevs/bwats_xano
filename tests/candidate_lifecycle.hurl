# Candidate lifecycle happy-path covering create, read, delete flow.

POST https://xano.atlanticsoft.co/api:Ks58d17q/auth/login?x-data-source=development
Content-Type: application/json

{
  "email": "{{TEST_USER_EMAIL}}",
  "password": "{{TEST_USER_PASSWORD}}"
}

HTTP 200
[Asserts]
jsonpath "$.authToken" exists
[Captures]
token: jsonpath "$.authToken"

POST https://xano.atlanticsoft.co/api:wosIWFpR:development/parsed_candidate?x-data-source=development
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "first_name": "Test",
  "last_name": "Candidate",
  "email": "{{newUuid}}@example.com",
  "phone_number": "+1234567890",
  "city": "Test City",
  "country": "Test Country",
  "short_role": "Tester",
  "linkedin_profile": "https://linkedin.com/in/test-candidate-{{newUuid}}",
  "elastic_search_document_id": "{{newUuid}}"
}

HTTP 200
[Asserts]
jsonpath "$.id" exists
[Captures]
candidate_id: jsonpath "$.id"

GET https://xano.atlanticsoft.co/api:wosIWFpR:development/parsed_candidate/{{candidate_id}}?x-data-source=development
Authorization: Bearer {{token}}

HTTP 200
[Asserts]
jsonpath "$.id" == {{candidate_id}}

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
