query parsed_candidate verb=POST {
  api_group = "candidates"

  input {
    dblink {
      table = "parsed_candidate"
    }
  }

  stack {
    db.add parsed_candidate {
      data = {
        created_at            : "now"
        public_name           : $input.public_name
        first_name            : $input.first_name
        last_name             : $input.last_name
        city                  : $input.city
        country               : $input.country
        languages             : $input.languages
        total_experience_years: $input.total_experience_years
        short_role            : $input.short_role
        headline_role         : $input.headline_role
        role_summary          : $input.role_summary
        technical_summary     : $input.technical_summary
        salary_aspiration     : $input.salary_aspiration
        employment_status     : $input.employment_status
        skills                : $input.skills
        work_history          : $input.work_history
        education             : $input.education
        certifications        : $input.certifications
        email                 : $input.email
        phone_number          : $input.phone_number
        linkedin_profile      : $input.linkedin_profile
        availability          : $input.availability
        resume_last_modified  : $input.resume_last_modified
        profile_last_updated  : $input.profile_last_updated
        industries            : $input.industries
        manatal_id            : $input.manatal_id
        picture               : $input.picture
      }
    } as $model
  
    conditional {
      if (($input.skills|is_empty) == false) {
        db.patch manatal_candidate {
          field_name = "manatal_id"
          field_value = $input.manatal_id
          data = {}|set:"parsed_date":now
        } as $manatal_candidate1
      }
    }
  }

  response = $model
}