function test_query {
  input {
    int page?
    json sort?
    json search?
  }

  stack {
    db.query comment {
      join = {
        user: {
          table: "user", 
          where: $db.comment.user_id == $db.user.id
        }
      }
    
      where = $db.comment.created_at < ("now"|timestamp_add_days:-14)
      additional_where = $input.search
      sort = {"comment.created_at": "desc"}
      override_sort = $input.sort
      eval = {name: $db.user.name}
      return = {
        type    : "list"
        distinct: "no"
        paging  : {page: $input.page, per_page: 10, totals: true, offset: 22}
      }
    
      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "perPage"
        "itemsTotal"
        "pageTotal"
        "items.id"
        "items.user_id"
        "items.created_at"
        "items.name"
      ]

      addon = [
        {name: "post", input: {post_id: $output.post_id}, as: "items.items.items.post"}
      ]
    } as $return_list

    db.bulk.delete comment {
      where = $db.comment.created_at < ("now"|timestamp_add_days: -30)
    } as $bulk_delete_old_comments
  
    db.query comment {
      join = {
        user: {table: "user", where: $db.comment.user_id == $db.user.id}
      }

      where = $db.comment.created_at < ("now"|timestamp_add_days: -14)
      additional_where = $input.search
      override_sort = $input.sort
      eval = {name: $db.user.name}
      return = {type: "exists"}
      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "perPage"
        "itemsTotal"
        "pageTotal"
        "items.id"
        "items.user_id"
        "items.content"
        "items.created_at"
        "items.name"
      ]
    
      addon = [
        {
          name: "post"
          input: {post_id: $output.post_id}
          as: "items.items.items.post"
        }
      ]
    } as $return_list

    db.query comment {
      join = {
        user: {table: "user", where: $db.comment.user_id == $db.user.id}
      }

      where = $db.comment.created_at < ("now"|timestamp_add_days: -14)
      additional_where = $input.search
      override_sort = $input.sort
      eval = {name: $db.user.name}
      return = {type: "count"}
     
      mock = {
        test_1: 33
        test_2: 11
      }
      
      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "perPage"
        "itemsTotal"
        "pageTotal"
        "items.id"
        "items.user_id"
        "items.content"
        "items.created_at"
        "items.name"
      ]

      addon = [
        {name: "post", input: {post_id: $output.post_id}, as: "items.items.items.post"}
      ]
    } as $return_count
  
    db.query comment {
      join = {
        user: {table: "user", where: $db.comment.user_id == $db.user.id}
      }

      where = $db.comment.created_at < ("now"|timestamp_add_days:-14)
      additional_where = $input.search
      sort = {comment.post_id: "asc"}
      override_sort = $input.sort
      eval = {name: $db.user.name}
      return = {type: "single"}
      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "perPage"
        "itemsTotal"
        "pageTotal"
        "items.id"
        "items.user_id"
        "items.content"
        "items.created_at"
        "items.name"
      ]
    
      addon = [
        {name: "post", input: {post_id: $output.post_id}, as: "items.items.items.post"}
      ]
    } as $return_single
  
    db.query comment {
      join = {
        user: {table: "user", where: $db.comment.user_id == $db.user.id}
      }

      where = $db.comment.created_at < ("now"|timestamp_add_days:-14)
      additional_where = $input.search
      sort = {comment.user_id: "asc"}
      override_sort = $input.sort
      eval = {name: $db.user.name}
      return = {
        type    : "stream"
        distinct: "yes"
        paging  : {page: $input.page, per_page: 25}
      }
    
      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "perPage"
        "itemsTotal"
        "pageTotal"
        "items.id"
        "items.user_id"
        "items.content"
        "items.created_at"
        "items.name"
      ]

      addon = [
        {name: "post", input: {post_id: $output.post_id}, as: "items.items.items.post"}
      ]
    } as $return_stream
  
    db.query comment {
      join = {
        user: {table: "user", where: $db.comment.user_id == $db.user.id}
      }

      where = $db.comment.created_at < ("now"|timestamp_add_days:-14)
      additional_where = $input.search
      sort = {count_name: "asc"}
      override_sort = $input.sort
      eval = {name: $db.user.name}
      return = {
        type  : "aggregate"
        paging: {page: $input.page, per_page: 25}
        group : {comment_content1: $db.comment.content}
        eval  : {count_name: $db.name|count}
      }

      addon = [
        {name: "post", input: {post_id: $output.post_id}, as: "items.items.items.post"}
      ]
    } as $return_aggregate
  
    db.query user {
      where = $db.user.id @> $db.user.name
      return = {type: "list"}
      addon = [
        {
          name : "post"
          as: "_post"
          input: {post_id: "post"}
          addon: [
            {name: "comment_of_post", input: {post_id: $output.id}, as: "items.items.items.comment_of_post"}
          ]
        }
      ]
    } as $user
  }

  response = $return_list
}