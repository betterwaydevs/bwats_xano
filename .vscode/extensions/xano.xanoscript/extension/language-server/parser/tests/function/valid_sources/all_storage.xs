function all_storage {
  input {
    image ?image?
    video ?video?
    audio ?audio?
    attachment ?attachment?
    file ?file?
  }

  tags = ["storage"]
  
  stack {
    storage.create_image {
      value = $input.image
      access = "private"
      filename = ""
    } as $image
  
    storage.create_attachment {
      value = $input.attachment
      access = "public"
      filename = "my_file.txt"
    } as $x1
  
    storage.read_file_resource {
      value = $input.file
    } as $file_data_content
  
    storage.create_file_resource {
      filename = "my_file.txt"
      filedata = $file_data_content
    } as $file_rsrce
  
    storage.delete_file {
      pathname = "foo_bar.txt"
    }
  
    storage.sign_private_url {
      pathname = "foo_bar.txt"
      ttl = 30
    } as $signed_url
  }

  response = $image
}