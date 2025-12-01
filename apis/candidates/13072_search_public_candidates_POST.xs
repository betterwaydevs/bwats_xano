query "search/public/candidates" verb=POST {
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
    text[] hide_ids? filters=trim
  }

  stack {
    var $private_information {
      value = false
    }
  
    function.run search_candidates_in_es {
      input = {
        max_salary             : $input.max_salary
        min_year_of_experience : $input.min_year_of_experience
        city                   : $input.city
        country                : $input.country
        page                   : $input.page
        item_per_page          : $input.item_per_page
        keyword_search         : $input.keyword_search
        id                     : $input.id
        private_information    : $private_information
        max_years_of_experience: $input.max_years_of_experience
        english_levels         : $input.english_levels
        must_skills            : $input.must_skills
        should_skills          : $input.should_skills
      }
    } as $func_1
  }

  response = $func_1

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