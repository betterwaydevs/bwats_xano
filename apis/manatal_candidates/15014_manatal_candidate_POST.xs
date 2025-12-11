query manatal_candidate verb=POST {
  input {
    dblink {
      table = "manatal_candidate"
      override = {resume_file: {hidden: true}}
    }
  
    file? resume_attachment?
    file? candidate_image?
  }

  stack {
    var $new_resume_file {
      value = ""
    }
  
    var $new_candidate_image {
      value = ""
    }
  
    try_catch {
      try {
        storage.create_attachment {
          value = $input.resume_attachment
          access = "private"
          filename = ""
        } as $new_resume_file
      
        storage.create_attachment {
          value = $input.candidate_image
          access = "private"
          filename = ""
        } as $new_candidate_image
      }
    }
  
    db.add manatal_candidate {
      data = {
        created_at       : "now"
        manatal_id       : $input.manatal_id
        full_name        : $input.full_name
        email            : $input.email
        resume           : $input.resume
        picture          : $input.picture
        phone_number     : $input.phone_number
        current_company  : $input.current_company
        current_position : $input.current_position
        description      : $input.description
        hash             : $input.hash
        custom_fields    : $input.custom_fields
        updated_at       : $input.updated_at
        gender           : $input.gender
        address          : $input.address
        latest_degree    : $input.latest_degree
        latest_university: $input.latest_university
        attachments      : $input.attachments
        notes            : $input.notes
        educations       : $input.educations
        experiences      : $input.experiences
        social_media     : $input.social_media
        linkedin         : $input.linkedin
        resume_file      : $new_resume_file
        candidate_image  : $new_candidate_image
      }
    } as $model
  }

  response = $model
}