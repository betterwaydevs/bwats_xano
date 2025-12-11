query db_query verb=GET {
  input
  stack {
    db.query book {
      where = `"book.id" == 123`
      eval = [
        {
          name  : "book.name"
          as    : "book_name"
          filter: [
            {name: "upper", disabled: true}
            {name: "add", arg: [{value: 123}]}
          ]
        }
      ]

      return_aggregate = {
        paging : {page: 1, per_page: 25, metadata: true}
        sorting: [{sort: "book_name", order: "asc"}]
        group  : [
          {
            name  : "book.name"
            as    : "book_name"
            filter: [{name: "lower"}]
          }
        ]
        eval   : [
          {name: "book.name", as: "book_name", filter: [{name: "sum"}]}
        ]
      }

      external_classic = {
        value      : "test"
        permissions: {search: true, sort: true, page: true, per_page: false}
      }

      external = {
        search  : "test"
        sort    : "test"
        page    : "test"
        per_page: "test"
        offset  : "test"
      }

      output = [
        "itemsReceived"
        "curPage"
        "nextPage"
        "prevPage"
        "offset"
        "perPage"
        "items.book_name"
      ]

      addon = [
        {
          name  : "book"
          as    : "_book"
          offset: "items[]"
          input : {book_id: "book_name"}
          addon : [
            {
              name  : "book"
              as    : "_book2222"
              offset: "obj"
              output: ["name", "name2"]
              input : {book_id: $env.API_KEY}
            }
          ]
        }
      ]

    } as book1
  }
  
  response = null
}