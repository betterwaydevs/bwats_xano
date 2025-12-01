function "video_ask/videoask_collect_form_responses" {
  input {
    text form_id filters=trim
    int responses_limit?=100
    text cursor? filters=trim
    int offset?
  }

  stack {
    var $request_cursor {
      value = $input.cursor
    }
  
    var $request_offset {
      value = $input.offset
    }
  
    conditional {
      if ($request_offset == null) {
        var.update $request_offset {
          value = 0
        }
      }
    }
  
    var $limit {
      value = $input.responses_limit
    }
  
    conditional {
      if ($limit > 200) {
        var.update $limit {
          value = 200
        }
      }
    }
  
    function.run "video_ask/videoask_get_form_responses" {
      input = {
        form_id: $input.form_id
        limit  : $limit
        cursor : $request_cursor
        offset : $request_offset
      }
    } as $page_wrapper
  
    var $page_body {
      value = $page_wrapper|get:"result":$page_wrapper
    }
  
    var $pages {
      value = []|push:$page_body
    }
  
    var $next_cursor_url {
      value = $page_body|get:"next":null
    }
  
    conditional {
      if ($next_cursor_url != null && $next_cursor_url != "") {
        var $query_string {
          value = ""
        }
      
        var $url_parts {
          value = $next_cursor_url|split:"?"
        }
      
        var $parts_count {
          value = $url_parts|count
        }
      
        conditional {
          if ($parts_count > 1) {
            var.update $query_string {
              value = $url_parts|get:1:""
            }
          }
        }
      
        var $next_cursor {
          value = null
        }
      
        var $next_offset_raw {
          value = null
        }
      
        var $pairs {
          value = $query_string|split:"&"
        }
      
        foreach ($pairs) {
          each as $pair {
            var $kv {
              value = $pair|split:"="
            }
          
            var $key {
              value = $kv|get:0:""
            }
          
            var $value {
              value = $kv|get:1:""
            }
          
            conditional {
              if ($key == "cursor") {
                var.update $next_cursor {
                  value = $value
                }
              }
            }
          
            conditional {
              if ($key == "offset") {
                var.update $next_offset_raw {
                  value = $value
                }
              }
            }
          }
        }
      
        var $next_offset {
          value = 0
        }
      
        conditional {
          if ($next_offset_raw != null && $next_offset_raw != "") {
            var.update $next_offset {
              value = $next_offset_raw|to_int
            }
          }
        }
      
        function.run "video_ask/videoask_collect_form_responses" {
          input = {
            form_id        : $input.form_id
            responses_limit: $input.responses_limit
            cursor         : $next_cursor
            offset         : $next_offset
          }
        } as $next_pages_wrapper
      
        var $next_pages {
          value = $next_pages_wrapper|get:"pages":[]
        }
      
        array.merge $pages {
          value = $next_pages
        }
      }
    }
  
    var $summary {
      value = {pages: $pages}
    }
  }

  response = $summary
}