query create_prospect_from_html verb=POST {
  api_group = "prospects"

  input {
    text profile_id? filters=trim
    text linked_url? filters=trim
    text linkedin_html? filters=trim
    int project_external_id?
    text email? filters=trim
  }

  stack {
    group {
      stack {
        var $parsed_prospect {
          value = null
        }
      
        conditional {
          if ($input.linked_url) {
            db.query parsed_prospect {
              where = ($db.parsed_prospect.linkedin_profile == $input.linked_url)
              return = {type: "single"}
            } as $existing_by_url
          
            var.update $parsed_prospect {
              value = ($existing_by_url ? $existing_by_url : $parsed_prospect)
            }
          }
        }
      
        conditional {
          if (!$parsed_prospect && $input.email) {
            db.query parsed_prospect {
              where = ($db.parsed_prospect.email == $input.email)
              return = {type: "single"}
            } as $existing_by_email
          
            var.update $parsed_prospect {
              value = ($existing_by_email ? $existing_by_email : $parsed_prospect)
            }
          }
        }
      
        conditional {
          if (!$parsed_prospect) {
            db.add parsed_prospect {
              data = {
                created_at                : "now"
                linkedin_profile          : $input.linked_url
                linked_recruit_profile_id : $input.profile_id
                linked_html               : $input.linkedin_html
                parse_status              : ""
                public_name               : ""
                first_name                : ""
                last_name                 : ""
                city                      : ""
                country                   : ""
                languages                 : {}
                total_experience_years    : 0
                short_role                : ""
                headline_role             : ""
                role_summary              : ""
                technical_summary         : ""
                salary_aspiration         : 0
                github_profile            : ""
                employment_status         : ""
                skills                    : {}
                work_history              : {}
                education                 : {}
                certifications            : {}
                project_id                : $input.project_external_id
                email                     : ($input.email | first_notnull: "")
                phone_number              : ""
                availability              : ""
                resume_last_modified      : ""
                profile_last_updated      : ""
                industries                : {}
                parsed_candidate_id       : "0"
                picture                   : ""
                openai_file_id            : ""
                elastic_search_document_id: ""
                normalized_date           : ""
                es_created_updated_date   : ""
              }
            } as $parsed_prospect
          
            !util.post_process {
              stack {
                api.request {
                  url = "https://betterwaydevs.app.n8n.cloud/webhook/add_candidate_prospect_from_linked"
                  method = "POST"
                  params = {}
                    |set:"linked_profile_id":$input.profile_id
                    |set:"candidate_html":$input.linkedin_html
                  headers = []
                    |push:"Content-Type: application/json"
                  timeout = 100
                } as $open_ia_parse
              }
            }
          }
        }
      }
    }
  }

  response = $parsed_prospect
}