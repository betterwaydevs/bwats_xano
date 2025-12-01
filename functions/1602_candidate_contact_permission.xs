function candidate_contact_permission {
  input {
    int candidate_id filters=min:1
    bool opt_in_matching_jobs?
    bool opt_in_marketing_general?
    text opt_in_matching_jobs_ip? filters=trim
    text opt_in_marketing_general_ip? filters=trim
    int opt_in_matching_jobs_at? filters=min:0
    int opt_in_marketing_general_at? filters=min:0
  }

  stack {
    var $fallback_ip {
      value = null
    }
  
    conditional {
      if ($input.opt_in_matching_jobs_ip != null && $input.opt_in_matching_jobs_ip != "") {
        var.update $fallback_ip {
          value = $input.opt_in_matching_jobs_ip
        }
      }
    }
  
    conditional {
      if ($fallback_ip == null && $input.opt_in_marketing_general_ip != null && $input.opt_in_marketing_general_ip != "") {
        var.update $fallback_ip {
          value = $input.opt_in_marketing_general_ip
        }
      }
    }
  
    var $opt_in_matching_jobs_ip_value {
      value = ($input.opt_in_matching_jobs_ip != null && $input.opt_in_matching_jobs_ip != "" ? $input.opt_in_matching_jobs_ip : $fallback_ip)
    }
  
    var $opt_in_marketing_general_ip_value {
      value = ($input.opt_in_marketing_general_ip != null && $input.opt_in_marketing_general_ip != "" ? $input.opt_in_marketing_general_ip : $fallback_ip)
    }
  
    var $current_epoch_ms {
      value = "now"|to_ms
    }
  
    var $opt_in_matching_jobs_at_value {
      value = null
    }
  
    conditional {
      if ($input.opt_in_matching_jobs != null) {
        var.update $opt_in_matching_jobs_at_value {
          value = ($input.opt_in_matching_jobs_at != null ? $input.opt_in_matching_jobs_at : $current_epoch_ms)
        }
      }
    }
  
    var $opt_in_marketing_general_at_value {
      value = null
    }
  
    conditional {
      if ($input.opt_in_marketing_general != null) {
        var.update $opt_in_marketing_general_at_value {
          value = ($input.opt_in_marketing_general_at != null ? $input.opt_in_marketing_general_at : $current_epoch_ms)
        }
      }
    }
  
    db.get candidate_contact_permission {
      field_name = "candidate_id"
      field_value = $input.candidate_id
    } as $existing_permission
  
    var $model {
      value = null
    }
  
    conditional {
      if ($existing_permission != null) {
        db.edit candidate_contact_permission {
          field_name = "id"
          field_value = $existing_permission.id
          data = {
            candidate_id               : $input.candidate_id
            opt_in_matching_jobs       : $input.opt_in_matching_jobs
            opt_in_matching_jobs_ip    : $opt_in_matching_jobs_ip_value
            opt_in_matching_jobs_at    : $opt_in_matching_jobs_at_value
            opt_in_marketing_general   : $input.opt_in_marketing_general
            opt_in_marketing_general_ip: $opt_in_marketing_general_ip_value
            opt_in_marketing_general_at: $opt_in_marketing_general_at_value
          }
        }
      
        db.get candidate_contact_permission {
          field_name = "id"
          field_value = $existing_permission.id
        } as $updated_permission
      
        var.update $model {
          value = $updated_permission
        }
      }
    }
  
    conditional {
      if ($existing_permission == null) {
        db.add candidate_contact_permission {
          data = {
            created_at                 : now
            candidate_id               : $input.candidate_id
            opt_in_matching_jobs       : $input.opt_in_matching_jobs
            opt_in_matching_jobs_ip    : $opt_in_matching_jobs_ip_value
            opt_in_matching_jobs_at    : $opt_in_matching_jobs_at_value
            opt_in_marketing_general   : $input.opt_in_marketing_general
            opt_in_marketing_general_ip: $opt_in_marketing_general_ip_value
            opt_in_marketing_general_at: $opt_in_marketing_general_at_value
          }
        } as $new_permission
      
        var.update $model {
          value = $new_permission
        }
      }
    }
  }

  response = $model
}