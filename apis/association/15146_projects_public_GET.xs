// Query all project records
query "projects/public" verb=GET {
  api_group = "association"

  input {
    int per_page?
    int page?
    int project_id?
  }

  stack {
    db.query project {
      where = $db.project.public && $db.project.status == "active" && $db.project.id ==? $input.project_id
      sort = {project.company_id: "asc", project.name: "asc"}
      return = {
        type  : "list"
        paging: {page: $input.page, per_page: $input.per_page}
      }
    
      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "offset"
        "items.id"
        "items.name"
        "items.description"
        "items.location"
        "items.status"
        "items.company_id"
        "items.public"
        "items.english_validation_url"
      ]
    
      addon = [
        {
          name  : "company"
          output: ["id", "is_visible", "display_name", "name"]
          input : {company_id: $output.company_id}
          as    : "items._company"
        }
      ]
    } as $model
  
    var $items {
      value = []
    }
  
    foreach ($model.items) {
      each as $item {
        var $company_meta {
          value = {id: null, name: null, is_visible: false}
        }
      
        conditional {
          if ($item._company != null) {
            var.update $company_meta {
              value = {
                id        : $item._company.id
                name      : (($item._company.display_name != null && $item._company.display_name != "") ? $item._company.display_name : $item._company.name)
                is_visible: $item._company["is_visible == true"]
              }
            }
          }
        }
      
        conditional {
          if ($company_meta.name == null || $company_meta.name == "") {
            var.update $company_meta {
              value = $company_meta|set:"name":"Stealth Company"
            }
          }
        }
      
        var.update $items {
          value = $items
            |push:```
              {
                id                     : $item.id
                name                   : $item.name
                description            : $item.description
                location               : $item.location
                status                 : $item.status
                company_id             : $item.company_id
                public                 : $item.public
                english_validation_url : $item.english_validation_url
                company                : $company_meta
              }
              ```
        }
      }
    }
  
    var.update $model {
      value = $model|merge:{items: $items}
    }
  }

  response = $model
}