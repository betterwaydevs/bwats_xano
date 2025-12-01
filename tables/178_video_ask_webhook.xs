// Stores incoming webhook data from VideoAsk, including GET and POST parameters.
table video_ask_webhook {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // JSON object containing GET request parameters from the VideoAsk webhook.
    json get_params?
  
    // JSON object containing POST request parameters or body from the VideoAsk webhook.
    json post_params?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}