function "bug regex xs" {
  input {
    text youtube_url? filters=trim
  }

  stack {
    var $youtube_id {
      value = ("/^((?:https?:)?\\/\\/)?((?:www|m)\\.)?((?:youtube\\.com|youtu.be))(\\/(?:[\\w\\-]+\\?v=|embed\\/|v\\/)?)([\\w\\-]+)(\\S+)?$/"|regex_get_all_matches:$input.youtube_url)[5]|first
    }
  }

  response = $youtube_id
}