query countries verb=GET {
  input {
  }

  stack {
    db.direct_query {
      sql = "SELECT DISTINCT parsed_candidate.country FROM x6_144 parsed_candidate ORDER BY parsed_candidate.country ASC;"
      response_type = "list"
    } as $x1
  
    !api.lambda {
      code = """
        const countryObjects = $var.x1;
        
        if (!Array.isArray(countryObjects)) {
          console.error('Error: Input $var.x1 is not an array.');
          // Return empty array or throw an error, depending on desired error handling
          return []; 
        }
        
        // 1. Extract country names from the array of objects
        const countryNames = countryObjects.map(obj => obj.country).filter(name => typeof name === 'string');
        
        // 2. Create a Set from the country names to automatically remove duplicates
        const uniqueCountryNamesSet = new Set(countryNames);
        
        // 3. Convert the Set back to an array
        const uniqueCountryNamesArray = Array.from(uniqueCountryNamesSet);
        
        // 4. Sort the array of unique country names alphabetically
        const sortedUniqueCountries = uniqueCountryNamesArray.sort((a, b) => a.localeCompare(b));
        
        return sortedUniqueCountries;
        """
      timeout = 10
    } as $x1
  }

  response = $x1
}