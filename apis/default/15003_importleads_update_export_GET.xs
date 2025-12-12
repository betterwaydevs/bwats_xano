query "IMPORTLEADS/UPDATE_EXPORT" verb=GET {
  api_group = "Default"

  input {
  }

  stack {
    db.query remoteweekly_leads {
      where = $db.remoteweekly_leads.exported == false
      return = {type: "list"}
    } as $remoteweekly_leads_1
  
    foreach ($remoteweekly_leads_1) {
      each as $item {
        db.edit remoteweekly_leads {
          field_name = "id"
          field_value = $item.id
          data = {exported: true}
        } as $remoteweekly_leads_2
      
        !debug.stop {
          value = ""
        }
      }
    }
  }

  response = $remoteweekly_positions_1
}