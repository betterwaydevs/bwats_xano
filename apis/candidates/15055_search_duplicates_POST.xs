query "search/duplicates" verb=POST {
  input {
    int page?=1
    int per_page?=20
  }

  stack {
    // Ensure page number is at least 1
    var $page {
      value = ($input.page|first_notnull:1|to_int)|max:1
    }
  
    // Ensure per_page is between 1 and 200
    var $per_page {
      value = ($input.per_page|first_notnull:20|to_int)|max:1|min:200
    }
  
    // Retrieve duplicate LinkedIn profiles and their associated candidates with pagination
    db.direct_query {
      sql = """
        WITH candidate_profiles AS (
          SELECT
            pc.id,
            pc.first_name,
            pc.last_name,
            pc.linkedin_profile,
            pc.elastic_search_document_id,
            pc.linked_recruit_profile_id,
            pc.email,
            pc.phone_number,
            pc.country,
            pc.city
          FROM x6_144 AS pc
          WHERE NULLIF(trim(coalesce(pc.linkedin_profile, '')), '') IS NOT NULL
        ),
        normalized_profiles AS (
          SELECT
            *,
            LOWER(TRIM(linkedin_profile)) AS normalized_linkedin_profile
          FROM candidate_profiles
        ),
        grouped_duplicates AS (
          SELECT
            normalized_linkedin_profile AS linkedin_profile,
            COUNT(*) AS duplicate_count,
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', id,
                'first_name', first_name,
                'last_name', last_name,
                'linkedin_profile', linkedin_profile,
                'elastic_search_document_id', elastic_search_document_id,
                'linkedin_profile_search_id', linked_recruit_profile_id,
                'email', email,
                'phone_number', phone_number,
                'country', country,
                'city', city
              ) ORDER BY id DESC
            ) AS candidates_array
          FROM normalized_profiles
          GROUP BY normalized_linkedin_profile
          HAVING COUNT(*) > 1
        ),
        paginated_results AS (
          SELECT
            linkedin_profile,
            duplicate_count,
            candidates_array,
            COUNT(*) OVER() AS total_groups_count -- Total count of groups before pagination
          FROM grouped_duplicates
          ORDER BY
            duplicate_count DESC,
            linkedin_profile ASC
          OFFSET {{ ($var.page - 1) * $var.per_page }}
          LIMIT {{ $var.per_page }}
        )
        SELECT * FROM paginated_results;
        """
      parser = "template_engine"
      response_type = "list"
    } as $duplicates
  }

  response = $duplicates
}