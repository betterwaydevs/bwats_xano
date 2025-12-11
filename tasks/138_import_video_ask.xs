task "import video ask" {
  stack {
    function.run "video_ask/videoask_sync_all" {
      input = {forms_limit: 200, form_ids: {}}
    } as $func1
  }

  schedule = [{starts_on: 2025-11-28 05:56:27+0000, freq: 86400}]
}