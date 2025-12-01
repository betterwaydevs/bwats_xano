// Utility API to migrate resume attachments from manatal_candidate to person_attachment records
// Migrate resume attachments from manatal_candidate to person_attachment records using native Xano joins and pagination
query "util/generate_attachments" verb=GET {
  input {
    // Page number for pagination (starts at 1)
    int page?=1 filters=min:1|max:1000
  
    // Number of records to process per page (max 100)
    int per_page?=50 filters=min:1|max:100000
  }

  stack {
    // Query parsed_candidates with native joins to manatal_candidates and person_attachment
    // Uses LEFT JOIN to filter out candidates that already have attachments
    db.query parsed_candidate {
      join = {
        manatal_candidate: {
          table: "manatal_candidate"
          where: $db.parsed_candidate.manatal_id == $db.manatal_candidate.manatal_id
        }
        person_attachment: {
          table: "person_attachment"
          type : "left"
          where: $db.parsed_candidate.id == $db.person_attachment.person_id && $db.person_attachment.person_type == "candidate"
        }
      }
    
      where = $db.parsed_candidate.manatal_id != null && $db.manatal_candidate.resume_file.name != "" && $db.person_attachment.id == null
      eval = {resume_file: $db.manatal_candidate.resume_file}
      return = {
        type  : "list"
        paging: {
          page    : $input.page
          per_page: $input.per_page
          totals  : true
        }
      }
    
      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "offset"
        "perPage"
        "itemsTotal"
        "pageTotal"
        "items.id"
        "items.first_name"
        "items.last_name"
        "items.manatal_id"
        "items.resume_file.access"
        "items.resume_file.path"
        "items.resume_file.name"
        "items.resume_file.type"
        "items.resume_file.size"
        "items.resume_file.mime"
        "items.resume_file.meta"
        "items.resume_file.url"
      ]
    } as $candidates_with_manatal
  
    // Initialize counters
    var $processed_count {
      value = 0
    }
  
    var $error_count {
      value = 0
    }
  
    var $errors {
      value = []
    }
  
    // Process each candidate with joined manatal data
    foreach ($candidates_with_manatal.items) {
      each as $candidate {
        try_catch {
          try {
            // Create new person_attachment record (resume file and duplicates already filtered by query)
            db.add person_attachment {
              data = {
                created_at : now
                person_id  : $candidate.id
                person_type: "candidate"
                file_type  : "resume"
                attachment : $candidate.resume_file
              }
            } as $new_attachment
          
            var.update $processed_count {
              value = $processed_count + 1
            }
          }
        
          catch {
            var.update $error_count {
              value = $error_count + 1
            }
          
            var.update $errors {
              value = $errors
                |push:```
                  {
                    candidate_id: $candidate.id
                    candidate_name: ($candidate.first_name + " " + $candidate.last_name)
                    manatal_id: $candidate.manatal_id
                    error_type: "attachment_creation_failed"
                    error_details: $error.message
                    timestamp: now
                  }
                  ```
            }
          }
        }
      }
    }
  }

  response = {
    success   : true
    message   : "Attachment migration batch completed"
    pagination: ```
      {
        current_page: $input.page
        per_page: $input.per_page
        total_records: $candidates_with_manatal.paging.total
        total_pages: $candidates_with_manatal.paging.pages
        has_more: $candidates_with_manatal.paging.has_more
      }
      ```
    stats     : ```
      {
        candidates_in_batch: ($candidates_with_manatal.items|count)
        processed: $processed_count
        errors: $error_count
      }
      ```
    errors    : $errors
  }
}