query "search/candidates_widget" verb=GET {
  api_group = "candidates"

  input {
    object[] must_skills? {
      schema
    }
  
    // the candidate skills we should ahve
    object[] should_skills? {
      schema {
        text[] variations? filters=trim
        int min_months?
      }
    }
  
    // the maximum salary expected 
    int? max_salary?
  
    // the minimun years of experience in total 
    int? min_year_of_experience?
  
    // The city where the candidate should be located
    text? city? filters=trim
  
    // the country where the candidate should be located
    text? country? filters=trim
  
    // what page to get
    int page?=1
  
    // the amount of items per page
    int item_per_page?=8
  
    text? keyword_search? filters=trim
    text? id? filters=trim
    int role_id
  }

  stack {
    db.get roles {
      field_name = "id"
      field_value = $input.role_id
    } as $roles1
  
    // Convert the role params to input params
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
  
    function.run search_candidates_in_es {
      input = {
        max_salary            : $roles_input.max_salary
        min_year_of_experience: $roles_input.min_year_of_experience
        city                  : $roles_input.city
        country               : $roles_input.country
        page                  : $input.page
        item_per_page         : $input.item_per_page
        keyword_search        : $roles_input.keyword_search
        id                    : ""
        private_information   : false
        must_skills           : $roles_input.must_skills
        should_skills         : $roles_input.should_skills
      }
    } as $candidates
  
    // Generate html widget
    // 
    api.lambda {
      code = """
        const candidates = $var.candidates?.hits?.hits;
        
        if (!candidates || candidates.length === 0) {
            return '<p>No candidates found.</p>';
        }
        
        const countryCodeMap = {
            "Argentina": "ar",
            "Australia": "au",
            "Belize": "bz",
            "Bolivia": "bo",
            "Brazil": "br",
            "Canada": "ca",
            "Chile": "cl",
            "Colombia": "co",
            "Costa Rica": "cr",
            "Cuba": "cu",
            "Dominican Republic": "do",
            "Ecuador": "ec",
            "El Salvador": "sv",
            "France": "fr",
            "Germany": "de",
            "Guatemala": "gt",
            "Honduras": "hn",
            "Ireland": "ie",
            "Italy": "it",
            "Jamaica": "jm",
            "Mexico": "mx",
            "Netherlands": "nl",
            "Nicaragua": "ni",
            "Panama": "pa",
            "Paraguay": "py",
            "Peru": "pe",
            "Portugal": "pt",
            "Puerto Rico": "pr",
            "Spain": "es",
            "Sweden": "se",
            "United Kingdom": "gb",
            "United States": "us",
            "United States of America": "us",
            "Uruguay": "uy",
            "Venezuela": "ve"
        };
        
        function getCountryCode(countryName) {
            return countryCodeMap[countryName] || null;
        }
        
        function slugify(text) {
            if (!text) return '';
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        }
        
        function generateSkillsHTML(skills) {
            if (!skills || skills.length === 0) return '';
        
            const skillLevels = {
                proficient: { title: 'Proficient (3+ years)', skills: [], color: 'rgb(21, 128, 61)', dot: 'rgb(34, 197, 94)', border: 'rgb(187, 247, 208)', bg: 'rgb(220, 252, 231)', text: 'rgb(22, 101, 52)' },
                competent: { title: 'Competent (1-3 years)', skills: [], color: 'rgb(29, 78, 216)', dot: 'rgb(59, 130, 246)', border: 'rgb(191, 219, 254)', bg: 'rgb(219, 234, 254)', text: 'rgb(30, 64, 175)' },
                learning: { title: 'Learning (<1 year)', skills: [], color: 'rgb(194, 65, 12)', dot: 'rgb(249, 115, 22)', border: 'rgb(253, 186, 116)', bg: 'rgb(254, 215, 170)', text: 'rgb(154, 52, 18)' }
            };
        
            skills.forEach(skill => {
                const years = skill.months_experience / 12;
                if (years >= 3) {
                    skillLevels.proficient.skills.push(skill);
                } else if (years >= 1) {
                    skillLevels.competent.skills.push(skill);
                } else {
                    skillLevels.learning.skills.push(skill);
                }
            });
        
            let html = '';
            for (const level in skillLevels) {
                const data = skillLevels[level];
                if (data.skills.length > 0) {
                    html += `<div style="margin-bottom: 0.75rem;">
                        <h4 style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; color: ${data.color};"><div style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background-color: ${data.dot};"></div>${data.title}</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                            ${data.skills.map(s => {
                                const years = (s.months_experience / 12).toFixed(1).replace('.0', '');
                                return `<span style="display: inline-block; padding: 0.18rem 0.7rem; font-size: 0.89rem; font-weight: 500; border-radius: 999px; border: 1.5px solid ${data.border}; background-color: ${data.bg}; color: ${data.text}; margin: 0 0.15em 0.15em 0; letter-spacing: 0.01em; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">${s.skill} • ${years}y</span>`;
                            }).join('')}
                        </div>
                    </div>`;
                }
            }
            return html;
        }
        
        function generateCandidateCard(candidate) {
            const source = candidate._source;
            const elasticId = candidate._id;
        
            const countryCode = getCountryCode(source.country);
            const flagHtml = countryCode ? `<img src="https://flagcdn.com/20x15/${countryCode}.png" alt="${source.country} flag" style="width: 20px; height: 15px; object-fit: cover; border-radius: 2px;">` : '';
        
            const firstName = source.display_name ? source.display_name.split(' ')[0] : '';
            const profileUrl = `https://candidates.betterway.dev/profile/${slugify(firstName)}-${slugify(source.headline_role)}--${elasticId}`;
        
            return `
            <div style="background: #fff; border-radius: 12px; box-shadow: 0 4px 24px 0 rgba(0,0,0,0.06); border: 1px solid #E5E7EB; margin: 0; padding: 0; overflow: hidden; display: flex; flex-direction: column; min-width: 320px; max-width: 370px; width: 100%; transition: box-shadow 0.2s; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;">
                <div>
                    <div style="padding: 1.5rem 1.5rem 0.75rem;">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.15rem; letter-spacing: -0.5px;">${source.display_name || 'N/A'}</h3>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                                        ${flagHtml}
                                        <div style="display: inline-flex; align-items: center; border-radius: 9999px; border: 1px solid #e5e7eb; padding: 2px 12px; font-size: 0.82rem; font-weight: 500; background: #f8fafc; color: #334155;">${source.country || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: rgb(75, 85, 99); margin-top: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>
                            <span style="font-weight: 500; color: #0e7490;">${source.headline_role || 'N/A'}</span>
                            <span style="color: #64748b;">• ${source.total_experience_years || 0} years experience</span>
                        </div>
                    </div>
                    <div style="padding: 0px 1.5rem 1.5rem;">
                        <div>
                            <p style="font-size: 0.97rem; color: #334155; margin-bottom: 1rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${source.technical_summary || ''}</p>
                        </div>
                        <div style="margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.35rem;">
                            ${generateSkillsHTML(source.skills)}
                        </div>
                    </div>
                </div>
                <div style="padding: 0 1.5rem 1.5rem; display: flex; justify-content: flex-end;">
                     <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" style="background: #2B5752; color: #fff; padding: 0.5rem 1.25rem; font-size: 0.95rem; font-weight: 600; border-radius: 8px; text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.3rem; box-shadow: 0 2px 8px 0 rgba(43,87,82,0.10); border: none; transition: background 0.16s;" onmouseover="this.style.background='#1e3a34';" onmouseout="this.style.background='#2B5752';">
                        View Profile
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1rem; height: 1rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>
            </div>`;
        }
        
        const gridHTML = candidates.map(generateCandidateCard).join('');
        
        return `<div style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; align-items: stretch;">${gridHTML}</div>`;
        """
      timeout = 10
    } as $html
  
    util.set_header {
      value = "Content-type: text/html"
      duplicates = "replace"
    }
  }

  response = $html

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