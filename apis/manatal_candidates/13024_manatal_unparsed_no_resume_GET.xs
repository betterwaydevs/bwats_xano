query manatal_unparsed_no_resume verb=GET {
  input {
    int page?
    int per_page?
  }

  stack {
    db.direct_query {
      sql = """
        SELECT 
          mc.*,
          mc.linkedin         AS candidate_linkedin,
          pp.linkedin_profile AS prospect_linkedin_profile,
          pp.linked_html      AS prospect_linked_html
        FROM x6_143 AS mc
        JOIN x6_146 AS pp
          ON lower(rtrim(trim(coalesce(pp.linkedin_profile, '')), '/')) = lower(rtrim(trim(coalesce(mc.linkedin, '')), '/'))
        WHERE mc.parsed_date IS NULL
          AND NULLIF(lower(rtrim(trim(coalesce(mc.linkedin, '')), '/')), '') IS NOT NULL
          AND NULLIF(lower(rtrim(trim(coalesce(pp.linkedin_profile, '')), '/')), '') IS NOT NULL
          AND NULLIF(coalesce(pp.linked_html, ''), '') IS NOT NULL
          AND NULLIF(trim(coalesce(mc.resume_url, '')), '') IS NULL
        ORDER BY mc.manatal_id DESC;
        """
      response_type = "list"
    } as $joined
  
    conditional {
      if ($joined|is_empty) {
        db.direct_query {
          sql = """
            SELECT
              pp.id,
              pp.linkedin_profile,
              pp.linked_html
            FROM x6_146 AS pp
            WHERE
              NULLIF(trim(coalesce(pp.linkedin_profile, '')), '') IS NOT NULL
              AND NULLIF(coalesce(pp.linked_html, ''), '') IS NOT NULL
              AND pp.linkedin_profile ~* '(%[0-9a-f]{2})+'
            ORDER BY pp.id DESC
            LIMIT 2000
            """
          response_type = "list"
        } as $fallback_prospects
      
        db.direct_query {
          sql = """
            SELECT
              mc.*
            FROM x6_143 AS mc
            WHERE mc.parsed_date IS NULL
              AND NULLIF(trim(coalesce(mc.linkedin, '')), '') IS NOT NULL
              AND NULLIF(trim(coalesce(mc.resume_url, '')), '') IS NULL
            ORDER BY mc.manatal_id DESC
            LIMIT 5000
            """
          response_type = "list"
        } as $fallback_candidates
      
        api.lambda {
          code = """
            const prospects = Array.isArray($var.fallback_prospects) ? $var.fallback_prospects : [];
            const candidates = Array.isArray($var.fallback_candidates) ? $var.fallback_candidates : [];
            
            const normalize = (value) => {
              const variants = new Set();
              if (typeof value !== 'string') {
                return variants;
              }
            
              const addVariant = (candidateValue) => {
                if (typeof candidateValue !== 'string') {
                  return;
                }
                const trimmed = candidateValue.trim();
                if (!trimmed) {
                  return;
                }
                const lower = trimmed.toLowerCase();
                variants.add(lower);
                if (lower.endsWith('/')) {
                  variants.add(lower.slice(0, -1));
                } else {
                  variants.add(`${lower}/`);
                }
              };
            
              addVariant(value);
              try {
                addVariant(decodeURI(value));
              } catch (error) {
                // Ignore decoding errors; fall back to raw variants.
              }
            
              return variants;
            };
            
            const candidateMap = new Map();
            candidates.forEach((candidate) => {
              if (!candidate || typeof candidate !== 'object') {
                return;
              }
              const candidateVariants = normalize(candidate.linkedin);
              candidateVariants.forEach((variant) => {
                if (!candidateMap.has(variant)) {
                  candidateMap.set(variant, candidate);
                }
              });
            });
            
            const matches = [];
            prospects.forEach((prospect) => {
              if (!prospect || typeof prospect !== 'object') {
                return;
              }
              const prospectVariants = normalize(prospect.linkedin_profile);
              for (const variant of prospectVariants) {
                if (candidateMap.has(variant)) {
                  const candidate = candidateMap.get(variant);
                  matches.push({
                    ...candidate,
                    candidate_linkedin: candidate?.linkedin ?? null,
                    prospect_linkedin_profile: prospect.linkedin_profile,
                    prospect_linked_html: prospect.linked_html
                  });
                  break;
                }
              }
            });
            
            return matches;
            """
          timeout = 10
        } as $fallback
      
        var.update $joined {
          value = $fallback
        }
      }
    }
  
    api.lambda {
      code = """
          const page = Number($input.page || 1);
          const perPage = Number($input.per_page || 10);
          const rows = Array.isArray($var.joined) ? $var.joined : [];
          const total = rows.length;
          const totalPages = Math.max(1, Math.ceil(total / perPage));
          const start = (page - 1) * perPage;
          const end = start + perPage;
          const items = rows.slice(start, end);
          const nextPage = page < totalPages ? page + 1 : null;
          return { items, page, per_page: perPage, total, total_pages: totalPages, nextPage };
        """
      timeout = 10
    } as $paged
  }

  response = $paged
}