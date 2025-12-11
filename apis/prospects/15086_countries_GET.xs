query countries verb=GET {
  input {
  }

  stack {
    api.lambda {
      code = """
        return {
          size: 0,
          aggs: {
            countries: {
              terms: {
                field: "country",
                size: 500
              }
            }
          }
        };
        """
      timeout = 10
    } as $es_query
  
    function.run "elastic_search/search_query" {
      input = {
        index      : "prospects"
        payload    : $es_query
        return_type: "search"
      }
    } as $es_result
  
    api.lambda {
      code = """
        const result = $var.es_result;
        if (!result || !result.aggregations || !result.aggregations.countries || !result.aggregations.countries.buckets) {
          return [];
        }
        return result.aggregations.countries.buckets
          .map(b => ({ country: b.key }))
          .filter(c => c.country && c.country.trim() !== '')
          .sort((a, b) => a.country.localeCompare(b.country));
        """
      timeout = 10
    } as $countries
  }

  response = $countries
}