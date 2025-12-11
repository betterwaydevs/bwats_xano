# Batch Candidate Creation - TDD Specification & Implementation Logic

## 1. TDD Workflow Strategy
This feature will be implemented using a strict Test-Driven Development (TDD) cycle.

1.  **Red Phase**: Create the Hurl test (`tests/batch_candidate_creation.hurl`) first. It **must fail** initially because the API does not yet support list inputs or batch processing.
2.  **Green Phase**: Modify the API and Function code to handle the batch input and implement the core logic. Run tests until they pass.
3.  **Refactor/Verify**: Optimize the code (as per logic spec) and ensure all edge cases (empty batch, invalid inputs) are handled correctly.

---

## 2. Logic Specification

### Input Interface
*   **Arguments**:
    *   `project_id` (Integer, required)
    *   `stage_id` (Integer, required)
    *   `candidates` (List of Objects, required)

### Optimization Strategy
#### A. Pre-Flight Validation (Run Once)
Instead of validating the project and stage inside the loop, perform these checks **once** at the beginning.
1.  **Fetch & Validate**:
    *   Query `stage` (by `stage_id`) and `project` (by `project_id`). Fail if not found.
    *   **Logic**: Verify `stage.project_id == project_id`. Fail if mismatch.
2.  **Outcome**: If this step fails, the entire batch request fails (Global Error 404/400).

#### B. Batch Processing Loop
Process the `candidates` list sequentially. Use a `try/catch` block inside the loop to ensure that one bad record does not fail the entire batch.

*   **Initialization**:
    *   `results = []`
    *   `stats = { total: candidates.count, created: 0, assigned: 0, failed: 0 }`

*   **Loop Logic (ForEach `item` in `candidates`)**:
    1.  **Try**:
        *   **Validation**:
            *   Check `first_name`, `last_name`, `linkedin_profile` presence.
            *   Validate `linkedin_profile` format (RegEx).
            *   *On Failure*: Throw specific error (caught below).
        *   **Normalize**:
            *   Clean LinkedIn URL (strip query params, trailing slashes).
        *   **Existence Check**:
            *   Query `parsed_candidate` for match (by Slug or URL).
            *   *Else*: Query `parsed_prospect` for match.
        *   **Action**:
            *   **If Found (Candidate or Prospect)**:
                *   Create `project_person_association` (Person + Project + Stage).
                *   Update `stats.assigned++`.
                *   Push success result (`status: 'assigned'`, `id`: ...).
            *   **If New**:
                *   Create Elasticsearch Document.
                *   Create `parsed_candidate`.
                *   Create `project_person_association`.
                *   Update `stats.created++`.
                *   Push success result (`status: 'created'`, `id`: ...).
    2.  **Catch**:
        *   Update `stats.failed++`.
        *   Push failure result (`status: 'failed'`, `error`: exception message).

### Output Structure
```json
{
  "total_processed": <int>,
  "created_count": <int>,
  "assigned_count": <int>,
  "failed_count": <int>,
  "results": [
    { "linkedin_profile": "...", "status": "...", "id": ..., "error": ... }
  ]
}
```

---

## 3. Test Specification & Samples

### Test 1: Standard Batch (Mixed Scenarios)
**Scenario**: One new candidate, one existing candidate, one invalid profile.
*   **Payload**:
    ```json
    {
      "project_id": 1,
      "stage_id": 1,
      "candidates": [
        {
          "linkedin_profile": "https://linkedin.com/in/new-batch-user",
          "first_name": "New", "last_name": "User"
        },
        {
          "linkedin_profile": "https://linkedin.com/in/existing-user",
          "first_name": "Existing", "last_name": "User"
        },
        {
          "linkedin_profile": "bad-url",
          "first_name": "Invalid", "last_name": "User"
        }
      ]
    }
    ```
*   **Expected Response**:
    ```json
    {
      "total_processed": 3,
      "created_count": 1,
      "assigned_count": 1,
      "failed_count": 1,
      "results": [
        { "status": "created", "linkedin_profile": "..." },
        { "status": "assigned", "linkedin_profile": "..." },
        { "status": "failed", "error": "..." }
      ]
    }
    ```

### Test 2: Empty Batch
*   **Payload**: `candidates: []`
*   **Expected Response**: `total_processed: 0`, `results: []`.

### Test 3: Missing Fields
*   **Payload**: `[{ "linkedin_profile": "..." }]` (Missing name)
*   **Expected Response**: `failed_count: 1`, `status: "failed"`, `error`: "Missing param...".

### Test 4: Invalid Project
*   **Payload**: `project_id: 99999`
*   **Expected Response**: HTTP 404 Error (Pre-flight check).
