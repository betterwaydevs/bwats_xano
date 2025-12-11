# Candidate Lifecycle Test Specification
## Objective
Verify the creation, retrieval, and deletion of a candidate using the Xano API.
## 1. Authentication
*   **Method**: Login with email and password.
*   **Credentials**: `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`.
*   **Output**: Auth Token.
## 2. Create Candidate
*   **Endpoint**: `POST /parsed_candidate`
*   **Headers**: 
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <token>`
*   **Payload**:
    ```json
    {
      "first_name": "Test",
      "last_name": "Candidate",
      "email": "test.candidate@example.com",
      "phone_number": "+1234567890",
      "city": "Test City",
      "country": "Test Country",
      "short_role": "Tester",
      "linkedin_profile": "https://linkedin.com/in/test-candidate-12345"
    }
    ```
*   **Assertions**:
    *   HTTP Status Code: `200`
    *   Response body contains `id`.
    *   Action: Capture `id` as `candidate_id`.
## 3. Verify Creation
*   **Endpoint**: `GET /parsed_candidate`
*   **Query Parameters**: 
    *   `not_indexed=true` (To find the newly created candidate in the DB before indexing)
*   **Assertions**:
    *   HTTP Status Code: `200`
    *   Response list contains item with `id` equal to `candidate_id`.
    *   `jsonpath "$.items[*].id"` includes `{{candidate_id}}`
## 4. Delete Candidate
*   **Endpoint**: `DELETE /candidates/{candidate_id}`
*   **Payload**:
    ```json
    {
      "parsed_candidate_id": <candidate_id>
    }
    ```
*   **Assertions**:
    *   HTTP Status Code: `200`
## 5. Verify Deletion
*   **Endpoint**: `GET /parsed_candidate`
*   **Query Parameters**: 
    *   `not_indexed=true`
*   **Assertions**:
    *   HTTP Status Code: `200`
    *   Response list does **not** contain item with `id` equal to `candidate_id`.
