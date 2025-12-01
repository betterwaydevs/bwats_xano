function IMPORTLEADS_BATCH {
  input {
  }

  stack {
    db.query remoteweekly_positions {
      where = `$db.remoteweekly_positions.active`
      return = {type: "list"}
    } as $positions
  
    foreach ($positions) {
      each as $position {
        for (10) {
          each as $current_page {
            function.run importLeads {
              input = {
                page     : $current_page|add:1
                position : $position.position
                is_search: $position.is_search
              }
            } as $leads
          
            !debug.log {
              value = $leads
            }
          
            conditional {
              if ($leads.count != 10) {
                break
              }
            }
          }
        }
      }
    }
  }

  response = $positions
}