function importLeads {
  input {
    int page
    text position filters=trim
    bool is_search
  }

  stack {
    !debug.log {
      value = $input.position|concat:"START:":""
    }
  
    conditional {
      if ($input.is_search) {
        api.request {
          url = "https://v1.remoteweekly.ai/api/jobs/search/?page="|concat:$input.page:""
          method = "POST"
          params = {}
            |set:"query":$input.position
            |set:"maxAge":115200
          headers = []
            |push:"content-type: application/json"
            |push:"Authorization: Bearer 8438cee3262c31871e1dc351cba67412"
            |push:"Cookie: PHPSSESID=cb67e89d5eadb88480e1b900a7a2dfaa"
        } as $jobs
      }
    
      else {
        api.request {
          url = "https://v1.remoteweekly.ai/api/jobs/"
          method = "GET"
          params = {}
            |set:"page":$input.page
            |set:"position":$input.position
            |set:"maxAge":115200
          headers = []
            |push:"authorization: Bearer 8438cee3262c31871e1dc351cba67412"
            |push:"content-type: application/json"
        } as $jobs
      }
    }
  
    !debug.log {
      value = $input.page|concat:"PAGE:":""
    }
  
    conditional {
      if ($jobs.response.result == false) {
        !debug.log {
          value = $input.position|concat:"NO RESULT":" "
        }
      
        debug.log {
          value = $input.position|concat:"NO RESPONSE":" "
        }
      }
    
      else {
        foreach ($jobs.response.result.items) {
          each as $item {
            group {
              stack {
                var $categories {
                  value = " "
                }
              
                var $labels {
                  value = " "
                }
              
                try_catch {
                  try {
                    foreach ($item.labels) {
                      each as $label {
                        text.append $labels {
                          value = $label|concat:$label:","
                        }
                      }
                    }
                  
                    foreach ($item.categories) {
                      each as $category {
                        text.append $categories {
                          value = $category|concat:$category:","
                        }
                      }
                    }
                  }
                }
              
                conditional {
                  if (($item.title|icontains:"sales") || ($item.title|icontains:"marketing") || ($item.title|icontains:"communication") || ($item.title|icontains:"internship") || ($item.title|icontains:"fellowship") || ($item.title|icontains:"director") || ($item.title|icontains:"Freelance") || ($item.title|icontains:"Writer")) {
                    continue
                  }
                }
              
                conditional {
                  if ($categories|icontains:"non-tech") {
                    continue
                  }
                }
              
                conditional {
                  if (true == ($item.lead|icontains:"hybryd")) {
                    continue
                  }
                }
              
                !debug.log {
                  value = $categories
                }
              }
            }
          
            !debug.stop {
              value = $item
            }
          
            try_catch {
              try {
                db.add remoteweekly_leads {
                  data = {
                    created_at   : now
                    uid          : $item.uid
                    title        : $item.title
                    lead         : $item.lead
                    companyName  : $item.companyName
                    location     : $item.location
                    categories   : $categories
                    labels       : $labels
                    link_list    : $item.links.original.list
                    link_detail  : $item.links.original.detail
                    posted_at    : $item.posted_at
                    created_at_rw: $item.created_at
                    exported     : ""
                  }
                } as $remoteweekly_leads_1
              
                debug.log {
                  value = $remoteweekly_leads_1
                }
              }
            
              catch {
                !debug.log {
                  value = "Duplicated"
                }
              }
            }
          }
        }
      }
    }
  }

  response = $jobs.response.result
}