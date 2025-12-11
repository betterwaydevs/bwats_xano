query "search/elastic_search_by_linked" verb=GET {
  input {
    text linked_in_profile? filters=trim
  }

  stack {
    precondition ($input.linked_in_profile != "")
    api.lambda {
      code = """
        const profile = ($input.linked_in_profile || "").trim();
        
        const elasticsearchQuery = {
          "size": 1,
          "_source": [
            "first_name",
            "last_name",
            "public_name",
            "country",
            "city",
            "headline_role",
            "short_role",
            "title",
            "total_experience_years",
            "score_percentage",
            "languages",
            "skills",
            "role_summary",
            "technical_summary",
            "employment_status",
            "work_history",
            "worked_history",
            "education",
            "certifications",
            "industries",
            "linkedin_profile",
            "github_profile",
            "linked_html",
            "apollo_data.apollo_id",
            "notes",
            "manatal_id",
            "email",
            "phone_number",
            "availability",
            "resume_last_modified",
            "profile_last_updated",
            "project_id",
            "parsed_candidate_id",
            "picture",
            "openai_file_id",
            "linked_recruit_profile_id",
            "es_created_updated_date",
            "parse_status"
          ],
          "query": {
            "term": {
              "linkedin_profile": profile
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
      index = "prospects"
      payload = `$es_query`
      size = ""
      from = 0
      sort = []
      included_fields = []
      return_type = "search"
    } as $es_response
  
    api.lambda {
      code = """
        const ensureArray = (value) => Array.isArray(value) ? value : (value == null ? [] : [value]);
        
        const esResult = $var.es_response || {};
        const hits = (((esResult || {}).hits || {}).hits) || [];
        if (hits.length === 0) {
          return null;
        }
        
        const firstHit = hits[0] || {};
        const source = firstHit._source ? { ...firstHit._source } : {};
        
        const prospect = {
          linked_recruit_profile_id: source.linked_recruit_profile_id ?? "",
          parse_status: source.parse_status ?? "parsed",
          public_name: source.public_name ?? "",
          first_name: source.first_name ?? "",
          last_name: source.last_name ?? "",
          city: source.city ?? "",
          country: source.country ?? "",
          languages: ensureArray(source.languages),
          total_experience_years: source.total_experience_years ?? null,
          short_role: source.short_role ?? "",
          headline_role: source.headline_role ?? "",
          role_summary: source.role_summary ?? "",
          technical_summary: source.technical_summary ?? "",
          github_profile: source.github_profile ?? "",
          employment_status: source.employment_status ?? "",
          skills: ensureArray(source.skills),
          work_history: Array.isArray(source.work_history)
            ? source.work_history
            : (Array.isArray(source.worked_history) ? source.worked_history : []),
          education: ensureArray(source.education),
          certifications: ensureArray(source.certifications),
          project_id: source.project_id ?? 0,
          email: source.email ?? "",
          phone_number: source.phone_number ?? "",
          availability: source.availability ?? "",
          resume_last_modified: source.resume_last_modified ?? "",
          profile_last_updated: source.profile_last_updated ?? null,
          industries: ensureArray(source.industries),
          parsed_candidate_id: source.parsed_candidate_id ?? 0,
          picture: source.picture ?? "",
          openai_file_id: source.openai_file_id ?? "",
          linkedin_profile: source.linkedin_profile ?? "",
          linked_html: source.linked_html ?? "",
          notes: source.notes ?? "",
          apollo_data: source.apollo_data ?? null,
          manatal_id: source.manatal_id ?? "",
          es_created_updated_date: source.es_created_updated_date ?? null,
          score_percentage: source.score_percentage ?? null
        };
        
        prospect.elastic_search_document_id = firstHit._id ?? "";
        prospect.elastic_search_id = firstHit._id ?? "";
        prospect.elastic_search_score = firstHit._score ?? null;
        
        return prospect;
        """
      timeout = 10
    } as $prospect
  }

  response = $prospect
}