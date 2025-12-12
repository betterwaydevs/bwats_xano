query validate_existing_invitations verb=POST {
  api_group = "linkedin"

  input {
    object[] connections? {
      schema {
        int user_id?
        text linkedin_profile? filters=trim
      }
    }
  }

  stack {
    api.lambda {
      code = """
        const connectionsList = Array.isArray($input.connections) ? $input.connections : [];
        
        const escapeSql = (value) => {
            if (value === null || typeof value === 'undefined') {
                return 'NULL';
            }
            if (typeof value === 'number' && isFinite(value)) {
                return value;
            }
            return `'${String(value).replace(/'/g, "''")}'`;
        };
        
        const ensureString = (value) => {
            if (typeof value === 'string') {
                return value.trim();
            }
            if (typeof value === 'number') {
                return String(value);
            }
            return '';
        };
        
        const buildSlugVariants = (inputSlug) => {
            const variants = new Set();
            const rawSlug = ensureString(inputSlug);
        
            if (!rawSlug) {
                return [];
            }
        
            variants.add(rawSlug);
        
            try {
                const encodedSlug = encodeURI(rawSlug);
                if (encodedSlug && encodedSlug !== rawSlug) {
                    variants.add(encodedSlug);
                }
            } catch (error) {
                // Ignore encoding errors and fall back to the raw slug only.
            }
        
            return Array.from(variants);
        };
        
        const connectionQueries = connectionsList
            .map((conn) => {
                if (!conn || typeof conn !== 'object') {
                    return null;
                }
        
                const userId = ensureString(conn.user_id);
                const slugSource = conn.Connection_Profile_URL ?? conn.linkedin_profile ?? conn.slug;
                const slugVariants = buildSlugVariants(slugSource);
        
                if (!userId || slugVariants.length === 0) {
                    return null;
                }
        
                const escapedUserId = escapeSql(userId);
                const escapedSlugs = slugVariants.map((variant) => escapeSql(variant));
                const escapedRawSlug = escapeSql(ensureString(slugSource));
        
                return `SELECT *, ${escapedRawSlug} AS "Connection_Profile_URL_Input" FROM x6_149 WHERE user_id = ${escapedUserId} AND "Connection_Profile_URL" IN (${escapedSlugs.join(', ')})`;
            })
            .filter((query) => typeof query === 'string' && query.length > 0);
        
        if (connectionQueries.length === 0) {
            return "SELECT * FROM x6_149 WHERE 1=0;";
        }
        
        return `${connectionQueries.join(' UNION ALL ')};`;
        """
      timeout = 10
    } as $sql_query
  
    db.direct_query {
      sql = "{{ $sql_query }}"
      parser = "template_engine"
      response_type = "list"
    } as $x2
  }

  response = $x2
}