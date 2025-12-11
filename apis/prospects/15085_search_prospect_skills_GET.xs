query "search/prospect_skills" verb=GET {
  input {
  }

  stack {
    cloud.elasticsearch.query {
      auth_type = "API Key"
      key_id = "mwmxdlijah"
      access_key = "pofdbdrvb3"
      region = ""
      index = "prospects"
      payload = {
        size: 0
        aggs: {
          "all_skills": {
            "nested": {
              "path": "skills"
            },
            "aggs": {
              "unique_skill_names": {
                "terms": {
                  "field": "skills.skill",
                  "size": 35000,
                  "order": {
                    "_key": "asc"
                  }
                }
              }
            }
          }
        }
      }
    
      size = ""
      from = 0
      sort = []
      included_fields = []
      return_type = "search"
    } as $x1
  
    // returns unique skills 
    api.lambda {
      code = """
        if (!$var || !$var.x1 || !$var.x1.aggregations) {
            console.log("Warning: $var.x1.aggregations not found or invalid. Ensure $var.x1 is populated correctly.");
            return [];
        }
        
        const aggregations = $var.x1.aggregations;
        let allBuckets = [];
        
        // Access buckets from the 'all_skills.unique_skill_names' aggregation path, as per the current ES query
        const skillBuckets = aggregations?.all_skills?.unique_skill_names?.buckets;
        if (Array.isArray(skillBuckets)) {
            allBuckets = allBuckets.concat(skillBuckets);
        }
        // If skills from other aggregation paths were intended to be merged,
        // the ES query would need to generate them, or additional logic added here to fetch them.
        
        // Extract skill names from all collected buckets
        // Ensure each bucket is valid and its key is a string
        const skillNames = allBuckets
            .filter(bucket => bucket && typeof bucket.key === 'string')
            .map(bucket => bucket.key);
        
        // Deduplicate skill names using a Set
        const uniqueSkillNames = [...new Set(skillNames)];
        
        // Transform unique skill names into an array of objects, e.g., { skill: "SkillName" }
        const skillObjects = uniqueSkillNames.map(name => ({ skill: name }));
        
        // Sort the array of skill objects alphabetically by the skill name
        skillObjects.sort((a, b) => a.skill.localeCompare(b.skill));
        
        return skillObjects;
        """
      timeout = 10
    } as $x1
  }

  response = $x1
}