query "search/by_elastic_search_id" verb=GET {
  auth = "user"

  input {
    text[] elastic_search_index? filters=trim
  }

  stack {
    api.lambda {
      code = """
        // Get the array from input
        const ids = $input.elastic_search_index || [];
        
        // Optional: Filter out empty/invalid IDs
        const validIds = ids.filter(id => id && id.trim() !== '');
        
        const elasticsearchQuery = {
          "size": validIds.length || 10000,  // Return all results - use array length or max 10k
          "_source": [
            // Identity
            "first_name",
            "last_name", 
            "public_name",
            "email",
            "phone_number",
            
            // Location
            "country",
            "city",
            "github_profile",
            // Role
            "headline_role",
            "short_role", 
            "title",
            
            // Experience & Score
            "total_experience_years",
            "score_percentage",
            "salary_aspiration",
            // Skills & Languages (arrays)
            "languages",
            "skills",
            "profile_last_updated",
            
            // Links
            "linkedin_profile",
            "github_profile",
            
            // Apollo & Notes
            "apollo_data.apollo_id",
            "notes",
            "old_system_notes",
            
            // IDs
            "manatal_id"
          ],
          "query": {
            "bool": {
              "must": [
                {
                  "terms": {
                    "_id": validIds
                  }
                }
              ]
            }
          }
        };
        
        return elasticsearchQuery;
        """
      timeout = 10
    } as $es_query
  
    cloud.elasticsearch.query {
      auth_type = "API Key"
      key_id = "mwmxdlijah"
      access_key = "pofdbdrvb3"
      region = ""
      index = "candidates"
      payload = `$es_query`
      size = ""
      from = 0
      sort = []
      included_fields = []
      return_type = "search"
    } as $x1
  }

  response = $x1
}