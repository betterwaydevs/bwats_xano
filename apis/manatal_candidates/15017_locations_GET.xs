query locations verb=GET {
  api_group = "manatal_candidates"

  input {
    bool is_america?
  }

  stack {
    conditional {
      if ($input.is_america) {
        db.direct_query {
          sql = """
            WITH cleaned_addresses AS (
                SELECT
                    address,
                    unaccent(lower(REGEXP_REPLACE(address, '\(.*\)', '', 'g'))) AS cleaned_address
                FROM x6_143
                WHERE address IS NOT NULL
            ),
            country_list AS (
                SELECT unnest(ARRAY[
                     'argentina', 'bolivia', 'brasil', 'brazil', 'chile', 'colombia', 'costa rica', 'cuba',
                    'república dominicana', 'dominican republic', 'ecuador', 'el salvador', 'guatemala',
                    'honduras', 'méxico', 'mexico', 'nicaragua', 'panamá', 'panama', 'paraguay',
                    'perú', 'peru', 'uruguay', 'venezuela','Bogota','Medellin','Pereira','Lima','Cucuta','Cali','Bucaramanga' , 'Canada'
                ]) AS country
            ),
            address_matches AS (
                SELECT
                    ca.address,
                    cl.country AS matched_country
                FROM cleaned_addresses ca
                LEFT JOIN country_list cl
                  ON ca.cleaned_address ILIKE '%' || cl.country || '%'
            )
            SELECT
                COALESCE(matched_country, address) AS location_grouped,
                COUNT(*) AS count
            FROM address_matches
            GROUP BY location_grouped
            ORDER BY count DESC;
            """
          response_type = "list"
        } as $x1
      }
    
      else {
        db.direct_query {
          sql = """
            
            WITH cleaned_addresses AS (
                SELECT
                    address,
                    unaccent(lower(REGEXP_REPLACE(address, '\(.*\)', '', 'g'))) AS cleaned_address
                FROM x6_143
                WHERE address IS NOT NULL
            ),
            country_list AS (
                SELECT unnest(ARRAY[
                    'argentina', 'bolivia', 'brasil', 'brazil', 'chile', 'colombia', 'costa rica', 'cuba',
                    'república dominicana', 'dominican republic', 'ecuador', 'el salvador', 'guatemala',
                    'honduras', 'méxico', 'mexico', 'nicaragua', 'panamá', 'panama', 'paraguay',
                    'perú', 'peru', 'uruguay', 'venezuela','Bogota','Medellin','Pereira','Lima','Cucuta','Cali','Bucaramanga','Canada', 'United States', 'United Kingdom'
                ]) AS country
            ),
            address_matches AS (
                SELECT
                    ca.address,
                    cl.country AS matched_country
                FROM cleaned_addresses ca
                LEFT JOIN country_list cl
                  ON ca.cleaned_address ILIKE '%' || cl.country || '%'
            )
            SELECT
                address AS unmatched_location
            FROM address_matches
            WHERE matched_country IS NULL
            GROUP BY address
            ORDER BY address DESC;
            """
          response_type = "list"
        } as $x1
      }
    }
  }

  response = $x1
}