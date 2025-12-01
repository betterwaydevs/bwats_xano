function search_candidates_in_es {
  input {
    // The candidate skills we want to search
    object[] must_skills? {
      schema {
        text[] variations? filters=trim
        int min_months?
      }
    }
  
    // the candidate skills we should ahve
    object[] should_skills? {
      schema {
        text[] variations? filters=trim
        int min_months?
      }
    }
  
    // the maximum salary expected 
    int max_salary?
  
    // the minimun years of experience in total 
    int min_year_of_experience?
  
    // The city where the candidate should be located
    text city? filters=trim
  
    // the country where the candidate should be located
    text country? filters=trim
  
    // what page to get
    int page?
  
    // the amount of items per page
    int item_per_page?
  
    text keyword_search? filters=trim
    text? id? filters=trim
    bool private_information?
    int? max_years_of_experience?
    text[] english_levels? filters=trim
    enum notes?=all {
      values = ["only_notes", "no_notes", "all"]
    }
  
    text[] hide_ids? filters=trim
  }

  stack {
    !var $private_information {
      value = $auth.extras.is_admin
    }
  
    // based on the inputs creates the elastic search query
    api.lambda {
      code = """
        // This script is designed to be used as a Xano Function.
        // It dynamically builds an Elasticsearch query based on input filters.
        
        // --- 1. Define Field Sets ---
        // Define search field sets
        const PRIVATE_NAME_SEARCH_FIELDS = ["first_name", "last_name", "public_name"];
        const PUBLIC_NAME_SEARCH_FIELDS = ["public_name", "first_name", "last_name"];
        
        const PRIVATE_WORK_HISTORY_FIELDS = [
            "work_history.role", "work_history.duties", "work_history.skills_used", 
            "work_history.description", "work_history.company", "work_history.anonymized_company"
        ];
        const PUBLIC_WORK_HISTORY_FIELDS = [
            "work_history.role", "work_history.duties", "work_history.skills_used", "work_history.description"
        ];
        
        const PRIVATE_EDUCATION_FIELDS = [
            "education.degree", "education.degree_level", "education.institution", "education.anonymized_institution"
        ];
        const PUBLIC_EDUCATION_FIELDS = ["education.degree", "education.degree_level"];
        const COMMON_PUBLIC_SEARCH_FIELDS = ["headline_role", "role_summary", "technical_summary", "city"];
        
        // Define fields to return in _source
        const BASE_SOURCE_FIELDS = [
            "id", "headline_role", "short_role", "skills", "role_summary", "technical_summary",
            "total_experience_years", "languages", "salary_aspiration", "country",
            "manatal_profile", "manatal_id", "work_history", "education"
        ];
        const PRIVATE_SOURCE_FIELDS = ["first_name", "last_name", "linkedin_profile", "github_profile", "city", "email", "phone_number","apollo_data", "notes","old_system_notes"];
        const PUBLIC_SOURCE_FIELDS = ["public_name"];
        
        // --- 2. Validate & Normalize Inputs ---
        if (!$input) {
            throw new Error('Input is required');
        }
        
        // Number coercion helper
        const toNum = (v, def = null) => (v === undefined || v === null || v === '') ? def : Number(v);
        
        // Coerce/validate min_year_of_experience
        if (typeof $input.min_year_of_experience !== 'number') {
            const coerced = toNum($input.min_year_of_experience, null);
            if (coerced === null || Number.isNaN(coerced)) {
                throw new Error('min_year_of_experience must be a number');
            }
            $input.min_year_of_experience = coerced;
        }
        
        // Validate/Coerce max_years_of_experience when provided
        if ($input.max_years_of_experience !== undefined && $input.max_years_of_experience !== null && typeof $input.max_years_of_experience !== 'number') {
            const coercedMax = toNum($input.max_years_of_experience, null);
            if (coercedMax === null || Number.isNaN(coercedMax)) {
                throw new Error('max_years_of_experience must be a number when provided');
            }
            $input.max_years_of_experience = coercedMax;
        }
        
        // Normalize arrays that may arrive as single values
        const normalizeArray = (v) => Array.isArray(v) ? v : (v == null ? [] : [v]);
        
        // --- 3. Determine if Recruiter/Private Access ---
        let isPrivate = false;
        let privateInfo = $input.private_information;
        let privateInfoExists = privateInfo !== undefined;
        if (!privateInfoExists && typeof $var !== 'undefined' && $var) {
            privateInfo = $var.private_information;
            privateInfoExists = privateInfo !== undefined;
        }
        if (privateInfoExists) {
            if (privateInfo === true || privateInfo === 1 || privateInfo === "1") {
                isPrivate = true;
            } else if (typeof privateInfo === 'string') {
                const lowerStr = String(privateInfo).toLowerCase();
                if (lowerStr === 'true' || lowerStr === 'yes' || lowerStr === '1') {
                    isPrivate = true;
                }
            } else if (typeof privateInfo === 'object' && privateInfo !== null) {
                try {
                    if (privateInfo.value === true || privateInfo.value === 1 || 
                        String(privateInfo.value).toLowerCase() === 'true') {
                        isPrivate = true;
                    }
                } catch (e) {}
            }
        }
        
        // --- If id is present, return only that document, with correct _source fields ---
        if ($input.id) {
            let sourceFields = BASE_SOURCE_FIELDS.concat(isPrivate ? PRIVATE_SOURCE_FIELDS : PUBLIC_SOURCE_FIELDS);
            const builtQuery = {
                _source: sourceFields,
                query: {
                    term: {
                        _id: $input.id
                    }
                }
            };
            if ($var?.debug_query === true) {
                return { debug_input: $input, built_query: builtQuery };
            }
            return builtQuery;
        }
        
        // --- 4. Set up Basic Query Structure ---
        const initialMustClauses = [];
        const experienceRange = { gte: $input.min_year_of_experience };
        if ($input.max_years_of_experience !== undefined && $input.max_years_of_experience !== null && typeof $input.max_years_of_experience === 'number' && $input.max_years_of_experience > 0) {
            experienceRange.lte = $input.max_years_of_experience;
        }
        initialMustClauses.push({ range: { "total_experience_years": experienceRange } });
        
        if ($input.country && typeof $input.country === 'string' && $input.country.trim() !== '') {
            initialMustClauses.push({ term: { "country": $input.country } });
        }
        
        let query = {
            query: {
                bool: {
                    must: initialMustClauses,
                    should: [],
                    must_not: []
                }
            }
        };
        
        const mustClauses = query.query.bool.must;
        const shouldClauses = query.query.bool.should;
        const mustNotClauses = query.query.bool.must_not;
        
        // --- 5. Process Must-Have Skills ---
        if ($input.must_skills && Array.isArray($input.must_skills)) {
            $input.must_skills.forEach(skill => {
                if (skill && Array.isArray(skill.variations) && skill.variations.length > 0 && typeof skill.min_months === 'number') {
                    mustClauses.push({
                        nested: {
                            path: "skills",
                            ignore_unmapped: true,
                            query: {
                                bool: {
                                    must: [
                                        { bool: { should: skill.variations.map(v => ({ match: { "skills.skill": v } })) } },
                                        { range: { "skills.months_experience": { gte: skill.min_months } } }
                                    ]
                                }
                            }
                        }
                    });
                }
            });
        }
        
        // --- 6. Process Should-Have Skills ---
        if ($input.should_skills && Array.isArray($input.should_skills)) {
            $input.should_skills.forEach(skill => {
                if (skill && Array.isArray(skill.variations) && skill.variations.length > 0 && typeof skill.min_months === 'number') {
                    shouldClauses.push({
                        nested: {
                            path: "skills",
                            ignore_unmapped: true,
                            query: {
                                bool: {
                                    must: [
                                        { bool: { should: skill.variations.map(v => ({ match: { "skills.skill": v } })) } },
                                        { range: { "skills.months_experience": { gte: skill.min_months } } }
                                    ]
                                }
                            }
                        }
                    });
                }
            });
        }
        
        // --- 7. Process Keyword Search ---
        if ($input.keyword_search && typeof $input.keyword_search === 'string' && $input.keyword_search.trim() !== '') {
            const keyword = $input.keyword_search.trim();
            const nameSearchFields = isPrivate ? PRIVATE_NAME_SEARCH_FIELDS : PUBLIC_NAME_SEARCH_FIELDS;
            const workHistorySearchFields = isPrivate ? PRIVATE_WORK_HISTORY_FIELDS : PUBLIC_WORK_HISTORY_FIELDS;
            const educationSearchFields = isPrivate ? PRIVATE_EDUCATION_FIELDS : PUBLIC_EDUCATION_FIELDS;
        
            // Use Elasticsearch's built-in accent-insensitive analyzer instead of generating variations
            
            // Build search queries with accent-insensitive analyzer
            const shouldClauses = [];
            
            // FIXED: Better search logic for compound names like "Federico Gabriel López"
            const terms = keyword.split(/\s+/);
            
            if (terms.length > 1) {
                // For multi-word searches: STRICT matching - ALL terms must be present
                // This prevents "Federico Gabriel López" from matching "Federico Calvo"
                
                const termQueries = terms.map(term => ({
                    multi_match: {
                        query: term,
                        fields: nameSearchFields,
                        fuzziness: "AUTO"  // Handle accent variations
                    }
                }));
                
                // ONLY use bool must - all terms required
                shouldClauses.push({
                    bool: {
                        must: termQueries,
                        boost: 20.0  // High boost for complete matches
                    }
                });
                
                // Add phrase search as secondary strategy (lower boost)
                shouldClauses.push({
                    multi_match: {
                        query: keyword,
                        fields: ["first_name", "last_name"],
                        type: "phrase",
                        boost: 10.0  // Lower boost than bool must
                    }
                });
                
            } else {
                // For single words: standard search with fuzziness
                shouldClauses.push({
                    multi_match: {
                        query: keyword,
                        fields: nameSearchFields,
                        fuzziness: "AUTO"  // Handle accent variations with fuzziness
                    }
                });
            }
        
            // Always search other fields, but with MUCH lower boost than name matches
            // This ensures name matches always rank higher than skill/role matches
            
            shouldClauses.push({ 
                query_string: { 
                    query: keyword, 
                    fields: COMMON_PUBLIC_SEARCH_FIELDS, 
                    default_operator: "AND",
                    boost: 0.1  // Very low boost - 200x lower than name matches
                } 
            });
            shouldClauses.push({ 
                nested: { 
                    path: "skills", 
                    ignore_unmapped: true, 
                    query: { 
                        query_string: { 
                            query: keyword, 
                            fields: ["skills.skill"], 
                            default_operator: "AND"
                        } 
                    },
                    boost: 0.1  // Very low boost
                } 
            });
            shouldClauses.push({ 
                nested: { 
                    path: "work_history", 
                    ignore_unmapped: true, 
                    query: { 
                        query_string: { 
                            query: keyword, 
                            fields: workHistorySearchFields, 
                            default_operator: "AND"
                        } 
                    },
                    boost: 0.1  // Very low boost
                } 
            });
            shouldClauses.push({ 
                nested: { 
                    path: "education", 
                    ignore_unmapped: true, 
                    query: { 
                        query_string: { 
                            query: keyword, 
                            fields: educationSearchFields, 
                            default_operator: "AND"
                        } 
                    },
                    boost: 0.1  // Very low boost
                } 
            });
        
            mustClauses.push({
                bool: {
                    should: shouldClauses
                }
            });
        }
        
        // --- 8. Process English Levels Filter (supports explicit levels + Unknown) ---
        const rawEnglishLevels = normalizeArray($input.english_levels)
          .map(x => String(x).trim())
          .filter(x => x.length > 0);
        
        const includeUnknownEnglish = rawEnglishLevels.some(lv => lv.toLowerCase() === 'unknown');
        const explicitEnglishLevels = rawEnglishLevels.filter(lv => lv.toLowerCase() !== 'unknown');
        
        if (explicitEnglishLevels.length > 0 || includeUnknownEnglish) {
          const englishShould = [];
        
          // Known levels (e.g., ["Native","Advanced"]) => nested match on English + level in terms
          if (explicitEnglishLevels.length > 0) {
            englishShould.push({
              nested: {
                path: "languages",
                ignore_unmapped: true,
                query: {
                  bool: {
                    must: [
                      { term: { "languages.language": "English" } },
                      { terms: { "languages.level": explicitEnglishLevels } }
                    ]
                  }
                }
              }
            });
          }
        
          if (includeUnknownEnglish) {
            // Case 1: There is an English entry but its level is missing/null
            englishShould.push({
              nested: {
                path: "languages",
                ignore_unmapped: true,
                query: {
                  bool: {
                    must: [ { term: { "languages.language": "English" } } ],
                    must_not: [ { exists: { field: "languages.level" } } ]
                  }
                }
              }
            });
        
            // Case 2: No English entry at all (treat as unknown)
            englishShould.push({
              bool: {
                must_not: [
                  {
                    nested: {
                      path: "languages",
                      ignore_unmapped: true,
                      query: { term: { "languages.language": "English" } }
                    }
                  }
                ]
              }
            });
          }
        
          mustClauses.push({ bool: { should: englishShould, minimum_should_match: 1 } });
        }
        
        // --- 8b. Process Email Filter (Private Only) --- Process Email Filter (Private Only) ---
        const rawHideIds = normalizeArray($input.hide_ids)
          .map(x => String(x).trim())
          .filter(x => x.length > 0);
        const hideIds = [];
        const hideIdsSeen = new Set();
        for (const id of rawHideIds) {
          if (!hideIdsSeen.has(id)) {
            hideIdsSeen.add(id);
            hideIds.push(id);
            if (hideIds.length === 1000) {
              break;
            }
          }
        }
        if (hideIds.length > 0) {
          mustNotClauses.push({ terms: { _id: hideIds } });
        }
        
        // --- 8b. Process Email Filter (Private Only) --- Process Email Filter (Private Only) ---
        if (isPrivate && $input.email && typeof $input.email === 'string' && $input.email.trim() !== '') {
            const emailValue = $input.email.trim();
            mustClauses.push({
                bool: {
                    should: [
                        { term: { "email.keyword": emailValue } },
                        { match_phrase: { "email": emailValue } }
                    ]
                }
            });
        }
        
        // --- 8c. Process Notes Filter ---
        let notesFilter = null;
        if (typeof $input.notes === 'string') {
            notesFilter = $input.notes.trim().toLowerCase();
        } else if ($input.notes && typeof $input.notes === 'object' && typeof $input.notes.value === 'string') {
            notesFilter = $input.notes.value.trim().toLowerCase();
        }
        if (notesFilter === 'only_notes') {
            mustClauses.push({ exists: { field: "notes" } });
        } else if (notesFilter === 'no_notes') {
            mustClauses.push({
                bool: {
                    must_not: [ { exists: { field: "notes" } } ]
                }
            });
        }
        
        // --- 9. Define Fields to Return (_source) ---
        const sourceFiltering = isPrivate 
            ? [...BASE_SOURCE_FIELDS, ...PRIVATE_SOURCE_FIELDS, ...PUBLIC_SOURCE_FIELDS]
            : [...BASE_SOURCE_FIELDS, ...PUBLIC_SOURCE_FIELDS];
        
        // --- 10. Apply Pagination ---
        let finalQueryToSend;
        if ($input.page > 0 && $input.item_per_page > 0) {
            const size = $input.item_per_page;
            const from = ($input.page - 1) * size;
            finalQueryToSend = { ...query, _source: sourceFiltering, size: size, from: from };
        } else {
            finalQueryToSend = { ...query, _source: sourceFiltering };
        }
        
        // Optional: debug view to compare flows side-by-side
        if ($var?.debug_query === true) {
            return { debug_input: $input, built_query: finalQueryToSend };
        }
        
        return finalQueryToSend;
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
      size = $input.item_per_page
      from = $input.page
      sort = []
      included_fields = []
      return_type = "search"
    } as $x1
  
    // Calcualte score and transform fields for public and private info
    // 
    api.lambda {
      code = """
        
        // This transformer processes Elasticsearch results to standardize candidate data representation
        // It adds score percentages and ensures consistent field access regardless of user type (guest/recruiter)
        
        const esResult = $var.x1;
        
        if (!esResult || !esResult.hits || !esResult.hits.hits || !esResult.hits.max_score) {
            console.log("Elasticsearch result, hits, hits.hits array, or max_score is missing or invalid.");
            return esResult; 
        }
        
        // --- 1. Calculate score percentages ---
        const maxScore = esResult.hits.max_score;
        
        // --- 2. Process and normalize each candidate hit ---
        esResult.hits.hits = esResult.hits.hits.map(hit => {
            // Add score percentage calculation
            const score = hit._score || 0;
            const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
            const scorePercentage = parseFloat(percentage.toFixed(2));
            
            // Get the source data (candidate information)
            const candidate = hit._source || {};
            
            // --- 3. Determine if private access is available ---
            // We check if private fields exist and if private_information is true
            const hasPrivateAccess = Boolean(candidate.first_name && candidate.last_name);
            
            // --- 4. Transform candidate data ---
            const transformedCandidate = {
                ...candidate,
                
                // 4.1 Name handling - consistently use public_name and display_name fields
                public_name: hasPrivateAccess ? 
                    `${candidate.first_name} ${candidate.last_name}` : 
                    (candidate.public_name || 'Anonymous Candidate'),
                    
                display_name: hasPrivateAccess ? 
                    `${candidate.first_name} ${candidate.last_name}` : 
                    (candidate.public_name || 'Anonymous Candidate'),
                
                // 4.2 Always remove first_name and last_name fields for consistency
                first_name: undefined,
                last_name: undefined,
                
                // 4.3 Handle sensitive identifiers for guest users
                ...(hasPrivateAccess ? {} : {
                    linkedin_profile: undefined,
                    github_profile: undefined,
                    manatal_id: undefined
                }),
                
                // 4.4 Add derived fields
                primary_skill: candidate.skills && candidate.skills.length > 0 ? 
                    candidate.skills.sort((a, b) => b.months_experience - a.months_experience)[0]?.skill : null,
                is_private_view: hasPrivateAccess
            };
            
            // --- 5. Transform work history ---
            if (transformedCandidate.work_history) {
                transformedCandidate.work_history = transformedCandidate.work_history.map(job => {
                    // Keep only relevant company field and remove the other
                    return {
                        ...job,
                        company: hasPrivateAccess ? job.company : job.anonymized_company,
                        anonymized_company: undefined  // Remove redundant field
                    };
                });
            }
            
            // --- 6. Transform education ---
            if (transformedCandidate.education) {
                transformedCandidate.education = transformedCandidate.education.map(edu => {
                    // Keep only relevant institution field and remove the other
                    return {
                        ...edu,
                        institution: hasPrivateAccess ? edu.institution : edu.anonymized_institution,
                        anonymized_institution: undefined  // Remove redundant field
                    };
                });
            }
            
            // --- 7. Return the enhanced hit ---
            return {
                ...hit,
                _source: transformedCandidate,
                score_percentage: scorePercentage
            };
        });
        
        // --- 8. Add metadata about the transformation ---
        esResult.transformation_info = {
            transformed_at: new Date().toISOString(),
            normalized_fields: ['names', 'work_history', 'education'],
            added_fields: ['display_name', 'primary_skill', 'is_private_view']
        };
        
        return esResult;
        """
      timeout = 10
    } as $x1
  }

  response = $x1
}