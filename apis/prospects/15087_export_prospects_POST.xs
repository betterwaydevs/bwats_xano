query "export/prospects" verb=POST {
  api_group = "prospects"
  auth = "user"

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
    int? max_years_of_experience?
    text[] english_levels? filters=trim
  }

  stack {
    var $private_information {
      value = true
    }
  
    function.run search_prospects_in_es {
      input = {
        max_salary             : $input.max_salary
        min_year_of_experience : $input.min_year_of_experience
        city                   : $input.city
        country                : $input.country
        page                   : $input.page
        item_per_page          : $input.item_per_page
        keyword_search         : $input.keyword_search
        id                     : $input.id
        private_information    : true
        max_years_of_experience: $input.max_years_of_experience
        english_levels         : $input.english_levels
        must_skills            : $input.must_skills
        should_skills          : $input.should_skills
      }
    } as $func_1
  
    api.lambda {
      code = """
        const headers = [
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Person Linkedin Url"
        ];
        
        // Helper function to safely quote a CSV field according to RFC 4180.
        // This ensures that values with commas or quotes are handled correctly.
        const quote = (value) => {
            if (value === null || value === undefined) {
                return '""'; // Return an empty quoted field for null/undefined values
            }
            const stringValue = String(value);
            // Escape any double quotes within the string by replacing them with two double quotes.
            const escapedValue = stringValue.replace(/"/g, '""');
            // Wrap the entire string in double quotes.
            return `"${escapedValue}"`;
        };
        
        // Create the header row by applying the quoting function to each header.
        const headerRow = headers.map(quote).join(',');
        const csvRows = [headerRow];
        
        // Safely access the array of search results from the Xano variable.
        // Prefer func_1; parse if JSON string. Fallback to x1.
        let root = $var?.func_1 ?? $var?.x1;
        if (typeof root === 'string') {
          try { root = JSON.parse(root); } catch (_) {}
        }
        const hits = Array.isArray(root?.hits?.hits) ? root.hits.hits : [];
        
        // Check if 'hits' is an array and then loop through every item to process all results.
        if (Array.isArray(hits)) {
            for (const hit of hits) {
                const source = hit._source;
                if (source) {
                    // Extract and split the full name into first and last names.
                    const nameParts = source.public_name ? source.public_name.split(' ') : [''];
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.slice(1).join(' ') || '';
        
                    // Create an array with the data for the current row.
                    const rowData = [
                        firstName,
                        lastName,
                        source.email,
                        source.phone_number,
                        source.linkedin_profile
                    ];
        
                    // Map each piece of data to its quoted CSV format and join with commas.
                    const dataRow = rowData.map(quote).join(',');
                    csvRows.push(dataRow);
                }
            }
        }
        
        // CSV text output only (copy/paste friendly, no BOM)
        const EOL = '\n';
        const clipboard = csvRows.join(EOL) + EOL;
        return clipboard; // fixed EOL
        """
      timeout = 10
    } as $csv_data
  
    !util.set_header {
      value = "Content-Type, text/csv"
      duplicates = "append"
    }
  
    !return {
      value = $csv_data
    }
  }

  response = $csv_data

  test "multiple skills" {
    input = {
      skills                : []|push:({}|set:"name":"Java"|set:"min_months":24)|push:({}|set:"name":"React"|set:"min_months":36)
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