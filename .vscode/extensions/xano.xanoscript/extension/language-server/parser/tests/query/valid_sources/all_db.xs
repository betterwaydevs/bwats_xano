query all_db verb=GET {
  input {
    int page?
    text query? filters=trim
  }

  stack {
    db.direct_query {
      sql = """
        SELECT *
        FROM users
        WHERE 
          users.email = "foo@example.com"
        """
    
      response_type = "list"
    } as $x1
  
    db.query array_columns {
      where = $db.array_columns contains $db.array_columns.id
      additional_where = $input.query
      join = {
        availability: {
          type  : "left"
          table  : "availability"
          where: $db.array_columns contains "foo"
        }
      }
    
      return = {
        type  : "list"
        paging : {
          page    : $input.page
          per_page: 25
          totals  : false
          offset  : 0
          metadata: true
        }
      }
      sort = {
        "array_columns.id": "asc"
      }
      output = [
        "itemsReceived"
        "curPage"
        "prevPage"
        "perPage"
        "items.id"
        "items.created_at"
        "items.many_text"
        "items.many_enum_required_private"
      ]

      addon = [
        {
          name  : "client"
          input : {client_id: $output.id}
          as    : "_client"
          addon : [
            {
              name  : "french_names"
              input : {french_names_id: $output.id}
              as    : "_french_names"
            }
          ]
        }
      ]
    } as $array_columns1
  
    db.query client {
      where = $db.client.email == "email@example.com"
    } as $client1
  
    db.has availability {
      field_name = "id"
      field_value = $input.query
    } as $availability1
  
    db.edit client {
      field_name = "id"
      field_value = $input.page
      data = {
        created_at  : $input.query
        name        : $array_columns1
        phone_number: "+1 (818) 7554 1234"
        address     : """
          780 Foxrun Drive
          Scarsdale, NY 10583
          """
        email       : "user@example.com"
      }
    } as $client2

    db.schema client {
      path = ""
    } as $client4
  }

  tags = ["db", "query"]

  response = $x1
}