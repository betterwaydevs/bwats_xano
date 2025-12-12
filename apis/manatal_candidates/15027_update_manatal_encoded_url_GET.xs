query update_manatal_encoded_url verb=GET {
  api_group = "manatal_candidates"

  input {
    int page?=1
    int per_page?=50
  }

  stack {
    var $page {
      value = ($input.page|first_notnull:1|to_int)|max:1
    }
  
    var $per_page {
      value = ($input.per_page|first_notnull:50|to_int)|min:200|max:1
    }
  
    var $offset {
      value = (($var.page|subtract:1)|max:0)|multiply:$var.per_page
    }
  
    db.direct_query {
      sql = """
        SELECT
          mc.id,
          mc.linkedin,
          mc.full_name,
          mc.address,
          mc.created_at
        FROM x6_143 AS mc
        WHERE
          NULLIF(trim(coalesce(mc.linkedin, '')), '') IS NOT NULL
          AND mc.linkedin ~* '(%[0-9a-f]{2})+'
        ORDER BY mc.id DESC
        LIMIT {{ $var.per_page }}
        OFFSET {{ $var.offset }};
        """
      parser = "template_engine"
      response_type = "list"
    } as $paginated_rows
  
    db.direct_query {
      sql = """
        SELECT
          COUNT(*) AS total
        FROM x6_143 AS mc
        WHERE
          NULLIF(trim(coalesce(mc.linkedin, '')), '') IS NOT NULL
          AND mc.linkedin ~* '(%[0-9a-f]{2})+'
        """
      response_type = "single"
    } as $totals
  
    var $total {
      value = ($var.totals.total|first_notnull:0)|to_int
    }
  
    var $total_pages {
      value = (($var.total|divide:$var.per_page)|ceil)|max:1
    }
  
    var $next_page {
      value = ($var.page < $var.total_pages) ? ($var.page|add:1) : null
    }
  
    var $items {
      value = $paginated_rows|safe_array
    }
  
    var $updated_records {
      value = []
    }
  
    foreach ($items) {
      each as $item {
        debug.log {
          value = $item.linkedin
        }
      
        var $decoded_linkedin {
          value = $item.linkedin|url_decode
        }
      
        db.edit manatal_candidate {
          field_name = "id"
          field_value = $item.id
          data = {linkedin: $decoded_linkedin}
          output = ["id", "linkedin"]
        } as $updated_record
      
        array.push $updated_records {
          value = $updated_record
        }
      }
    }
  }

  response = {
    items      : $updated_records
    page       : $page
    per_page   : $per_page
    total      : $total
    total_pages: $total_pages
    next_page  : $next_page
  }
}