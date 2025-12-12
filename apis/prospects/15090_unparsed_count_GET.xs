query unparsed_count verb=GET {
  api_group = "prospects"

  input {
  }

  stack {
    db.direct_query {
      sql = """
          SELECT
            COALESCE(NULLIF(p.parse_status, ''), 'pending') AS status_group,
            COUNT(*) AS prospect_count,
            MAX(p.created_at) AS newest_prospect_date
          FROM
            x6_146 AS p
          WHERE
            COALESCE(p.parse_status, '') != 'parsed'
          GROUP BY 1
          ORDER BY 1;
        """
      parser = "template_engine"
      response_type = "list"
    } as $x1
  }

  response = $x1
}