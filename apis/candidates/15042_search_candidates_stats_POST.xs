query "search/candidates_stats" verb=POST {
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
  
    // optional list of acceptable countries (OR logic)
    text[] countries? filters=trim
  
    text keyword_search? filters=trim
    text? id? filters=trim
    int? role_id?
    int? max_years_of_experience?
    text[] english_levels? filters=trim
  }

  stack {
    !var $private_information {
      value = $auth.extras.is_admin
    }
  
    // based on the inputs creates the elastic search query
    !api.lambda {
      code = """
        // This script is designed to be used as a Xano Function.
        // It dynamically builds an Elasticsearch query based on input filters.
        
        // --- 1. Define Field Sets ---
        // Define search field sets
        const PRIVATE_NAME_SEARCH_FIELDS = ["first_name", "last_name", "public_name"];
        const PUBLIC_NAME_SEARCH_FIELDS = ["public_name"];
        
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
        const PRIVATE_SOURCE_FIELDS = ["first_name", "last_name", "linkedin_profile", "github_profile", "city"];
        const PUBLIC_SOURCE_FIELDS = ["public_name"];
        
        // --- 2. Validate Inputs ---
        if (!$input) {
            throw new Error('Input is required');
        }
        if (typeof $input.min_year_of_experience !== 'number') {
            throw new Error('min_year_of_experience must be a number');
        }
        
        // Normalize arrays that may arrive as single values
        const normalizeArray = (v) => Array.isArray(v) ? v : (v == null ? [] : [v]);
        
        const normalizedCountries = normalizeArray($input.countries ?? $input.country)
          .map(v => typeof v === 'string' ? v.trim() : '')
          .filter(v => v.length > 0);
        
        // --- 3. Determine if Recruiter/Private Access ---
        // Check for private_information in both possible locations: $input and $var
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
            return {
                _source: sourceFields,
                query: {
                    term: {
                        _id: $input.id
                    }
                }
            };
        }
        
        // --- 4. Set up Basic Query Structure ---
        const initialMustClauses = [];
        initialMustClauses.push({ range: { "total_experience_years": { gte: $input.min_year_of_experience } } });
        
        if (normalizedCountries.length > 0) {
            initialMustClauses.push({ terms: { "country": normalizedCountries } });
        }
        
        let query = {
            query: {
                bool: {
                    must: initialMustClauses,
                    should: []
                }
            }
        };
        
        const mustClauses = query.query.bool.must;
        const shouldClauses = query.query.bool.should;
        
        // --- 5. Process Must-Have Skills ---
        if ($input.must_skills && Array.isArray($input.must_skills)) {
            $input.must_skills.forEach(skill => {
                if (skill && Array.isArray(skill.variations) && skill.variations.length > 0 && typeof skill.min_months === 'number') {
                    mustClauses.push({
                        nested: {
                            path: "skills",
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
            
            // Select appropriate field sets based on privacy flag
            const nameSearchFields = isPrivate ? PRIVATE_NAME_SEARCH_FIELDS : PUBLIC_NAME_SEARCH_FIELDS;
            const workHistorySearchFields = isPrivate ? PRIVATE_WORK_HISTORY_FIELDS : PUBLIC_WORK_HISTORY_FIELDS;
            const educationSearchFields = isPrivate ? PRIVATE_EDUCATION_FIELDS : PUBLIC_EDUCATION_FIELDS;
        
            mustClauses.push({
                bool: {
                    should: [
                        { query_string: { query: keyword, fields: [...COMMON_PUBLIC_SEARCH_FIELDS, ...nameSearchFields], default_operator: "AND" } },
                        { nested: { path: "skills", query: { query_string: { query: keyword, fields: ["skills.skill"], default_operator: "AND" } } } },
                        { nested: { path: "work_history", query: { query_string: { query: keyword, fields: workHistorySearchFields, default_operator: "AND" } } } },
                        { nested: { path: "education", query: { query_string: { query: keyword, fields: educationSearchFields, default_operator: "AND" } } } }
                    ]
                }
            });
        }
        
        // --- 8. Define Fields to Return (_source) ---
        const sourceFiltering = isPrivate 
            ? [...BASE_SOURCE_FIELDS, ...PRIVATE_SOURCE_FIELDS, ...PUBLIC_SOURCE_FIELDS]
            : [...BASE_SOURCE_FIELDS, ...PUBLIC_SOURCE_FIELDS];
        
        // --- 9. Apply Pagination ---
        let finalQueryToSend;
        if ($input.page > 0 && $input.item_per_page > 0) {
            const size = $input.item_per_page;
            const from = ($input.page - 1) * size;
            finalQueryToSend = { ...query, _source: sourceFiltering, size: size, from: from };
        } else {
            finalQueryToSend = { ...query, _source: sourceFiltering };
        }
        
        return finalQueryToSend;
        """
      timeout = 10
    } as $es_query
  
    // Calcualte score and transform fields for public and private info
    // 
    !api.lambda {
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
  
    conditional {
      if ($input.role_id != null) {
        db.get roles {
          field_name = "id"
          field_value = $input.role_id
        } as $roles1
      
        api.lambda {
          code = """
            if ($var.roles1 && $var.roles1.search_json) {
                const roleSearchParams = $var.roles1.search_json;
            
                // Iterate over the keys in the role's search data
                for (const key in roleSearchParams) {
                    // Check if the input object has the same key before overwriting
                    if (Object.prototype.hasOwnProperty.call($input, key)) {
                        $input[key] = roleSearchParams[key];
                    }
                }
            }
            
            return $input;
            """
          timeout = 10
        } as $roles_input
      }
    }
  
    api.lambda {
      code = """
        const roleInput = $var.roles_input;
        const input = roleInput ? roleInput : $input;
        
        if (!input) {
          throw new Error('Input is required');
        }
        
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
        
        const toNum = (v, def = null) => (v === undefined || v === null || v === '') ? def : Number(v);
        const normalizeArray = (v) => Array.isArray(v) ? v : (v == null ? [] : [v]);
        
        function resolvePrivateFlag(inputValue) {
          let privateInfo = (inputValue ? inputValue.private_information : undefined);
          if (privateInfo === undefined && typeof $var !== 'undefined' && $var) {
            privateInfo = $var.private_information;
          }
          if (privateInfo === true || privateInfo === 1 || privateInfo === "1") {
            return true;
          }
          if (typeof privateInfo === "string") {
            const lower = privateInfo.toLowerCase();
            if (lower === "true" || lower === "yes" || lower === "1") {
              return true;
            }
          }
          if (privateInfo && typeof privateInfo === "object") {
            try {
              const value = privateInfo.value;
              if (value === true || value === 1 || String(value).toLowerCase() === "true") {
                return true;
              }
            } catch (err) {}
          }
          return false;
        }
        
        const aggregations = {
          by_country: {
            terms: { field: "country", size: 10 }
          },
          by_experience: {
            range: {
              field: "total_experience_years",
              ranges: [
                { key: "Junior", from: 0, to: 2 },
                { key: "Semi Senior", from: 2, to: 5 },
                { key: "Senior", from: 5, to: 10 },
                { key: "Senior +", from: 10 }
              ]
            }
          },
          langs: {
            nested: { path: "languages" },
            aggs: {
              english_only: {
                filter: { term: { "languages.language": "English" } },
                aggs: {
                  levels: {
                    terms: { field: "languages.level", size: 10 }
                  }
                }
              }
            }
          },
          top_skills: {
            nested: { path: "skills" },
            aggs: {
              skills_names: {
                terms: { field: "skills.skill", size: 20 }
              }
            }
          }
        };
        
        const isPrivate = resolvePrivateFlag(input);
        
        if (typeof input.min_year_of_experience !== 'number') {
          const coerced = toNum(input.min_year_of_experience, null);
          if (coerced === null || Number.isNaN(coerced)) {
            throw new Error('min_year_of_experience must be a number');
          }
          input.min_year_of_experience = coerced;
        }
        
        if (input.max_years_of_experience !== undefined && input.max_years_of_experience !== null && typeof input.max_years_of_experience !== 'number') {
          const coercedMax = toNum(input.max_years_of_experience, null);
          if (coercedMax === null || Number.isNaN(coercedMax)) {
            throw new Error('max_years_of_experience must be a number when provided');
          }
          input.max_years_of_experience = coercedMax;
        }
        
        const normalizedCountries = normalizeArray(input.countries ?? input.country)
          .map(v => typeof v === 'string' ? v.trim() : '')
          .filter(v => v.length > 0);
        
        if (input.id) {
          return {
            size: 0,
            query: {
              term: {
                _id: input.id
              }
            },
            aggs: aggregations
          };
        }
        
        const initialMustClauses = [];
        const experienceRange = { gte: input.min_year_of_experience };
        if (typeof input.max_years_of_experience === 'number' && input.max_years_of_experience > 0) {
          experienceRange.lte = input.max_years_of_experience;
        }
        initialMustClauses.push({ range: { "total_experience_years": experienceRange } });
        
        if (normalizedCountries.length > 0) {
          initialMustClauses.push({ terms: { "country": normalizedCountries } });
        }
        
        const query = {
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
        
        if (input.must_skills && Array.isArray(input.must_skills)) {
          input.must_skills.forEach(skill => {
            if (skill && Array.isArray(skill.variations) && skill.variations.length > 0) {
              let minMonths = 0;
              if (typeof skill.min_months === 'number' && Number.isFinite(skill.min_months)) {
                minMonths = skill.min_months;
              } else if (skill.min_months != null) {
                const parsed = parseFloat(skill.min_months);
                if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
                  minMonths = parsed;
                }
              }
              mustClauses.push({
                nested: {
                  path: "skills",
                  ignore_unmapped: true,
                  query: {
                    bool: {
                      must: [
                        { bool: { should: skill.variations.map(v => ({ match: { "skills.skill": v } })) } },
                        { range: { "skills.months_experience": { gte: minMonths } } }
                      ]
                    }
                  }
                }
              });
            }
          });
        }
        
        if (input.should_skills && Array.isArray(input.should_skills)) {
          input.should_skills.forEach(skill => {
            if (skill && Array.isArray(skill.variations) && skill.variations.length > 0) {
              let minMonths = 0;
              if (typeof skill.min_months === 'number' && Number.isFinite(skill.min_months)) {
                minMonths = skill.min_months;
              } else if (skill.min_months != null) {
                const parsed = parseFloat(skill.min_months);
                if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
                  minMonths = parsed;
                }
              }
              shouldClauses.push({
                nested: {
                  path: "skills",
                  ignore_unmapped: true,
                  query: {
                    bool: {
                      must: [
                        { bool: { should: skill.variations.map(v => ({ match: { "skills.skill": v } })) } },
                        { range: { "skills.months_experience": { gte: minMonths } } }
                      ]
                    }
                  }
                }
              });
            }
          });
        }
        
        if (input.keyword_search && typeof input.keyword_search === 'string' && input.keyword_search.trim() !== '') {
          const keyword = input.keyword_search.trim();
          const nameSearchFields = isPrivate ? PRIVATE_NAME_SEARCH_FIELDS : PUBLIC_NAME_SEARCH_FIELDS;
          const workHistorySearchFields = isPrivate ? PRIVATE_WORK_HISTORY_FIELDS : PUBLIC_WORK_HISTORY_FIELDS;
          const educationSearchFields = isPrivate ? PRIVATE_EDUCATION_FIELDS : PUBLIC_EDUCATION_FIELDS;
        
          const keywordShouldClauses = [];
          const terms = keyword.split(/\s+/);
        
          if (terms.length > 1) {
            const termQueries = terms.map(term => ({
              multi_match: {
                query: term,
                fields: nameSearchFields,
                fuzziness: "AUTO"
              }
            }));
        
            keywordShouldClauses.push({
              bool: {
                must: termQueries,
                boost: 20.0
              }
            });
        
            keywordShouldClauses.push({
              multi_match: {
                query: keyword,
                fields: ["first_name", "last_name"],
                type: "phrase",
                boost: 10.0
              }
            });
        
          } else {
            keywordShouldClauses.push({
              multi_match: {
                query: keyword,
                fields: nameSearchFields,
                fuzziness: "AUTO"
              }
            });
          }
        
          keywordShouldClauses.push({ 
            query_string: { 
              query: keyword, 
              fields: COMMON_PUBLIC_SEARCH_FIELDS, 
              default_operator: "AND",
              boost: 0.1 
            } 
          });
          keywordShouldClauses.push({ 
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
              boost: 0.1 
            } 
          });
          keywordShouldClauses.push({ 
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
              boost: 0.1 
            } 
          });
          keywordShouldClauses.push({ 
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
              boost: 0.1 
            } 
          });
        
          mustClauses.push({
            bool: {
              should: keywordShouldClauses
            }
          });
        }
        
        const rawEnglishLevels = normalizeArray(input.english_levels)
          .map(x => String(x).trim())
          .filter(x => x.length > 0);
        
        const includeUnknownEnglish = rawEnglishLevels.some(lv => lv.toLowerCase() === 'unknown');
        const explicitEnglishLevels = rawEnglishLevels.filter(lv => lv.toLowerCase() !== 'unknown');
        
        if (explicitEnglishLevels.length > 0 || includeUnknownEnglish) {
          const englishShould = [];
        
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
        
        const rawHideIds = normalizeArray(input.hide_ids)
          .map(x => String(x).trim())
          .filter(x => x.length > 0);
        const hideIds = [];
        const hideIdsSeen = new Set();
        for (const id of rawHideIds) {
          if (!hideIdsSeen.has(id)) {
            hideIdsSeen.add(id);
            hideIds.push(id);
            if (hideIds.length === 10000) {
              break;
            }
          }
        }
        if (hideIds.length > 0) {
          mustNotClauses.push({ terms: { _id: hideIds } });
        }
        
        if (isPrivate && input.email && typeof input.email === 'string' && input.email.trim() !== '') {
          const emailValue = input.email.trim();
          mustClauses.push({
            bool: {
              should: [
                { term: { "email.keyword": emailValue } },
                { match_phrase: { "email": emailValue } }
              ]
            }
          });
        }
        
        let notesFilter = null;
        if (typeof input.notes === 'string') {
          notesFilter = input.notes.trim().toLowerCase();
        } else if (input.notes && typeof input.notes === 'object' && typeof input.notes.value === 'string') {
          notesFilter = input.notes.value.trim().toLowerCase();
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
        
        return {
          size: 0,
          query: { bool: query.query.bool },
          aggs: aggregations
        };
        """
      timeout = 10
    } as $es_query
  
    function.run "elastic_search/search_query" {
      input = {
        index      : "candidates"
        payload    : $es_query
        return_type: "search"
      }
    } as $candidates_stats
  }

  response = $candidates_stats

  test "multiple skills" {
    input = {
      skills                : []
      max_salary            : 5000
      min_year_of_experience: 5
      city                  : "Bogota"
      country               : "Colombia"
      page                  : 1
      item_per_page         : 10
    }
  
    expect.to_equal ($response.query) {
      value = '{"bool":{"must":[{"match":{"city.keyword":"Bogota"}},{"match":{"country.keyword":"Colombia"}},{"range":{"salary_aspiration":{"lte":5000}}},{"range":{"total_experience_years":{"gte":5}}},{"nested":{"path":"skills","query":{"bool":{"must":[{"bool":{"must":[{"match":{"skills.skill.keyword":"Java"}},{"range":{"skills.months_experience":{"gte":24}}}]}},{"bool":{"must":[{"match":{"skills.skill.keyword":"React"}},{"range":{"skills.months_experience":{"gte":36}}}]}}]}}}}]}}'|json_decode
    }
  
    expect.to_equal ($response.from) {
      value = 0
    }
  
    expect.to_equal ($response.size) {
      value = 10
    }
  }
}