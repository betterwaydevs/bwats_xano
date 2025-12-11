query all_zip verb=GET {
  input {
    file ?file?
  }

  stack {
    zip.create_archive {
      filename = "some_file.zip"
      password = "foo bar"
      password_encryption = "standard"
    } as $zip_file
  
    zip.add_to_archive {
      file = $input.file
      filename = ""
      zip = $zip_file
      password = ""
      password_encryption = ""
    }
  
    zip.delete_from_archive {
      filename = $input.file
      zip = $input.file
      password = ""
    }
  
    zip.extract {
      zip = $zip_file
      password = ""
    } as $output
  
    zip.view_contents {
      zip = $input.file
      password = ""
    } as $zip_content
  }

  response = $x1
}