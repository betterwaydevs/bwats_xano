# Populate Elasticsearch Dev Cluster – Plan

1. **Extract source data**
   - Run `elastic_search/migrate_dev_data` from a development branch.
   - Request desired counts (default 100 each, max 10,000) for prospects and candidates.
   - Confirm the helper returns randomized batches (100 items/page) plus metadata.

2. **Normalize payloads**
   - Review `parsed_candidate` and `parsed_prospect` schemas to ensure required fields (names, contact info, skills, work history, education, etc.) are present.
   - Map DB fields to the live Elasticsearch document structure shown in the reference samples.
   - Store prepared payload arrays for candidates (target index `candidate`) and prospects (target index `prospect`).

3. **Replay into dev Elasticsearch**
   - Loop through each prepared array.
   - For every record, call `elastic_search/document` with `method="POST"`, `index` set to the dev index, `doc_id` blank (let ES assign) and the mapped payload.
   - Insert documents sequentially with a ~500 ms delay between requests to avoid rate limits.

4. **Verify migration**
   - After each batch, query the dev cluster (via `elastic_search/search_query`) to confirm document counts and spot-check sample documents.
   - Log successes/failures to track progress and retry any failed inserts.

5. **Clean up / iterate**
   - Adjust requested limits or payload mapping as needed.
   - Once dev data looks correct, consider automating the replay step or integrating it into a scripted migration workflow.