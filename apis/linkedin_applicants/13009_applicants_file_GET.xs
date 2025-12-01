query applicants_file verb=GET {
  input {
    dblink {
      table = "linkedin_applicants"
      override = {
        name            : {hidden: true}
        location        : {hidden: true}
        created_at      : {hidden: true}
        description     : {hidden: true}
        application_id  : {hidden: true}
        linkedin_profile: {hidden: true}
      }
    }
  }

  stack {
    conditional {
      if ($input.company == "sh") {
        db.query sh_linkedin_applicants {
          where = $db.sh_linkedin_applicants.job_id ==? $input.job_id
          return = {type: "list"}
          output = [
            "application_id"
            "name"
            "location"
            "linkedin_profile"
            "description"
            "job_id"
          ]
        } as $linkedin_applicants
      }
    
      else {
        db.query linkedin_applicants {
          where = $db.linkedin_applicants.job_id ==? $input.job_id
          return = {type: "list"}
          output = [
            "application_id"
            "name"
            "location"
            "linkedin_profile"
            "description"
            "job_id"
          ]
        } as $linkedin_applicants
      }
    }
  
    util.set_header {
      value = "Content-Type: text/csv"
      duplicates = "replace"
    }
  
    var $filename {
      value = $input.job_id|concat:"csv":"."
    }
  
    util.set_header {
      value = "Content-Disposition: attachment;filename="|concat:$filename:""
      duplicates = "replace"
    }
  
    var $rows {
      value = []
    }
  
    object.keys {
      value = $linkedin_applicants.0
    } as $headers
  
    foreach ($linkedin_applicants) {
      each as $row {
        object.values {
          value = $row
        } as $values
      
        array.push $rows {
          value = $values
        }
      }
    }
  
    var $csv {
      value = $headers|csv_create:$rows:",":'"':"\\"
    }
  }

  response = $csv
}