function "elastic_search/prepare_payload" {
  input {
    json records
    enum person_type?=candidate {
      values = ["candidate", "prospect"]
    }
  }

  stack {
    var $items {
      value = $input.records|safe_array
    }
  
    var $cleaned {
      value = []
    }
  
    foreach ($items) {
      each as $rec {
        conditional {
          if ($input.person_type == "candidate") {
            // Coerce salary to float
            var $salary_float {
              value = (($rec.salary_aspiration ?? 0) / 1.0)
            }
          
            var $skills {
              value = $rec.skills|safe_array
            }
          
            var $languages {
              value = $rec.languages|safe_array
            }
          
            var $work_history_clean {
              value = []
            }
          
            foreach ($rec.work_history|safe_array) {
              each as $job {
                var $start_date_norm {
                  value = $job.start_date
                }
              
                var $end_date_norm {
                  value = $job.end_date
                }
              
                var $duties_text {
                  value = $job.duties|json_encode
                }
              
                var $job_clean {
                  value = {}
                    |set:"role":$job.role
                    |set:"company":$job.company
                    |set:"anonymized_company":$job.anonymized_company
                    |set:"start_date":$start_date_norm
                    |set:"end_date":$end_date_norm
                    |set:"is_current":$job.is_current
                    |set:"months_duration":$job.months_duration
                    |set:"description":$job.description
                    |set:"duties":$duties_text
                    |set:"skills_used":($job.skills_used|safe_array)
                }
              
                array.push $work_history_clean {
                  value = $job_clean
                }
              }
            }
          
            var $candidate_clean {
              value = {}
                |set:"id":$rec.id
                |set:"created_at":$rec.created_at
                |set:"public_name":$rec.public_name
                |set:"first_name":$rec.first_name
                |set:"last_name":$rec.last_name
                |set:"city":$rec.city
                |set:"country":$rec.country
                |set:"languages":$languages
                |set:"total_experience_years":$rec.total_experience_years
                |set:"short_role":$rec.short_role
                |set:"headline_role":$rec.headline_role
                |set:"role_summary":$rec.role_summary
                |set:"technical_summary":$rec.technical_summary
                |set:"salary_aspiration":$salary_float
                |set:"employment_status":$rec.employment_status
                |set:"availability":$rec.availability
                |set:"skills":$skills
                |set:"work_history":$work_history_clean
                |set:"education":($rec.education|safe_array)
                |set:"certifications":($rec.certifications ?? "")
                |set:"email":$rec.email
                |set:"phone_number":$rec.phone_number
                |set:"linkedin_profile":$rec.linkedin_profile
                |set:"github_profile":$rec.github_profile
                |set:"picture":$rec.picture
                |set:"openai_file_id":$rec.openai_file_id
                |set:"elastic_search_document_id":$rec.elastic_search_document_id
                |set:"profile_last_updated":$rec.profile_last_updated
                |set:"resume_last_modified":$rec.resume_last_modified
                |set:"industries":($rec.industries|safe_array)
                |set:"manatal_id":$rec.manatal_id
                |set:"normalized_date":$rec.normalized_date
                |set:"es_created_updated_date":$rec.es_created_updated_date
            }
          
            array.push $cleaned {
              value = $candidate_clean
            }
          }
        
          else {
            // Prospect payload (minimal safe subset)
            var $skills {
              value = $rec.skills|safe_array
            }
          
            var $languages {
              value = $rec.languages|safe_array
            }
          
            var $work_history_clean {
              value = []
            }
          
            foreach ($rec.work_history|safe_array) {
              each as $job {
                var $duties_text {
                  value = $job.duties|json_encode
                }
              
                var $job_clean {
                  value = {}
                    |set:"role":$job.role
                    |set:"company":$job.company
                    |set:"anonymized_company":$job.anonymized_company
                    |set:"start_date":$job.start_date
                    |set:"end_date":$job.end_date
                    |set:"is_current":$job.is_current
                    |set:"months_duration":$job.months_duration
                    |set:"description":$job.description
                    |set:"duties":$duties_text
                    |set:"skills_used":($job.skills_used|safe_array)
                }
              
                array.push $work_history_clean {
                  value = $job_clean
                }
              }
            }
          
            var $salary_float {
              value = (($rec.salary_aspiration ?? 0) / 1.0)
            }
          
            var $prospect_clean {
              value = {}
                |set:"id":$rec.id
                |set:"created_at":$rec.created_at
                |set:"public_name":$rec.public_name
                |set:"first_name":$rec.first_name
                |set:"last_name":$rec.last_name
                |set:"city":$rec.city
                |set:"country":$rec.country
                |set:"languages":$languages
                |set:"total_experience_years":$rec.total_experience_years
                |set:"short_role":$rec.short_role
                |set:"headline_role":$rec.headline_role
                |set:"role_summary":$rec.role_summary
                |set:"technical_summary":$rec.technical_summary
                |set:"salary_aspiration":$salary_float
                |set:"employment_status":$rec.employment_status
                |set:"availability":$rec.availability
                |set:"skills":$skills
                |set:"work_history":$work_history_clean
                |set:"education":($rec.education|safe_array)
                |set:"certifications":($rec.certifications ?? "")
                |set:"email":$rec.email
                |set:"phone_number":$rec.phone_number
                |set:"linkedin_profile":$rec.linkedin_profile
                |set:"github_profile":$rec.github_profile
                |set:"picture":$rec.picture
                |set:"openai_file_id":$rec.openai_file_id
                |set:"elastic_search_document_id":$rec.elastic_search_document_id
                |set:"profile_last_updated":$rec.profile_last_updated
                |set:"resume_last_modified":$rec.resume_last_modified
                |set:"industries":($rec.industries|safe_array)
                |set:"manatal_id":$rec.manatal_id
                |set:"normalized_date":$rec.normalized_date
                |set:"es_created_updated_date":$rec.es_created_updated_date
                |set:"linked_html":$rec.linked_html
                |set:"linked_recruit_profile_id":$rec.linked_recruit_profile_id
                |set:"general_notes":$rec.general_notes
                |set:"old_system_notes":$rec.old_system_notes
            }
          
            array.push $cleaned {
              value = $prospect_clean
            }
          }
        }
      }
    }
  }

  response = {total: $cleaned|count, data: $cleaned}
}