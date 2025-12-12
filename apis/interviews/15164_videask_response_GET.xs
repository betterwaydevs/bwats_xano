// Query all videask_response records
query videask_response verb=GET {
  api_group = "interviews"
  auth = "user"

  input {
    int per_page?
    int page?
  }

  stack {
    db.query videask_response {
      sort = {videask_response.last_synced_at: "desc"}
      return = {
        type  : "list"
        paging: {page: $input.page, per_page: $input.per_page}
      }
    } as $model
  }

  response = $model
}