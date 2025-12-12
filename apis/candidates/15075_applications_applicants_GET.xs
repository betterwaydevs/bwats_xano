// Query all application_notification records 
query "applications/applicants" verb=GET {
  api_group = "candidates"
  auth = "user"

  input {
    int page?
    int per_page?
    enum status?=pending {
      values = ["pending", "read"]
    }
  }

  stack {
    db.query application_notification {
      where = $db.application_notification.status ==? $input.status
      sort = {application_notification.id: "desc"}
      return = {
        type  : "list"
        paging: {page: $input.page, per_page: $input.per_page}
      }
    
      addon = [
        {
          name  : "company"
          output: [
            "display_name"
            "logo.access"
            "logo.path"
            "logo.name"
            "logo.type"
            "logo.size"
            "logo.mime"
            "logo.meta"
            "logo.url"
          ]
          input : {company_id: ""}
          as    : "items._company"
        }
        {
          name  : "project"
          output: ["id", "name"]
          input : {project_id: $output.project_id}
          as    : "items._project"
        }
        {
          name  : "parsed_candidate"
          output: ["id", "first_name", "last_name", "elastic_search_document_id"]
          input : {parsed_candidate_id: $output.candidate_id}
          as    : "items._parsed_candidate"
        }
      ]
    } as $model
  
    var $response_body {
      value = []
    }
  
    foreach ($model.items) {
      each as $item {
        var $resume_url {
          value = null
        }
      
        conditional {
          if ($item.resume != null && $item.resume.path != null) {
            conditional {
              if ($item.resume.access == "private") {
                storage.sign_private_url {
                  pathname = $item.resume.path
                  ttl = 3600
                } as $signed_url
              
                var.update $resume_url {
                  value = $signed_url
                }
              }
            
              else {
                var.update $resume_url {
                  value = "https://xano.atlanticsoft.co/" ~ $item.resume.path
                }
              }
            }
          }
        }
      
        var.update $response_body {
          value = $response_body
            |push:```
              ($item
                |merge:{
                  resume_url: $resume_url
                }
              )
              ```
        }
      }
    }
  }

  response = ($model | merge: {items: $response_body})
}