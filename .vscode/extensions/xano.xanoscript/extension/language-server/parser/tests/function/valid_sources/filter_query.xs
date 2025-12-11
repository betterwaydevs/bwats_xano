function queries {
  input {
  }

  stack {
    db.query invoices {
      where = $db.clients.name == $db.invoices.total_amount || $db.invoices contains $db.clients.name && ($db.invoices.items != $db.clients.name || $db.invoices.client_id > $db.invoices.id || $db.clients.is_active not in $db.invoices.id || $db.invoices.id in $db.invoices.id || $env.$request_method contains "something" || $db.clients.name includes $db.clients.id || ($db.invoices.total_amount|add:55) not contains $db.clients.name && $db.invoices.items overlaps $db.invoices.id || $db.invoices.items not overlaps $db.invoices.items)
      join = {
        clients: {
          type  : "right"
          table  : "clients"
          where: $db.invoices.client_id == $db.clients.id
        }
      }
    
      return = {
        type  : "list"
        paging: {
          page    : 1
          per_page: 25
          totals  : false
          offset  : 0
          metadata: true
        }
      }
    } as $invoices1
  
    db.query books {
      join = {
        user: {
          table: "user"
          where: $db.books.id == $db.user.id
        }
      }
    
      return = {
        type    : "stream"
        distinct: "yes"
        paging  : {page: 1, per_page: 25}
      }
      
      sort = { "books.title": "asc"}
    
    } as $books1
  
    db.query book_club_meeting {
      return = {
        type: "exists"
      }
    } as $book_club_meeting1
  
    db.query book_club_meeting {
      description = "Some description"
      return = {
        type: "count"
      }
    } as $book_club_meeting2
  
    db.query book_club_meeting {
      disabled = true
      sort = {"book_club_meeting.id": "asc"}
      return = {
        type :"single"
      }
    } as $book_club_meeting2
  
    db.query book_club_meeting {
      sort = {
        "book_club_meeting_book_id": "asc"
      }
      return = {
        type : "aggregate"
        group  : {"book_club_meeting.book_id": "book_club_meeting.book_id"}
        eval   : {
           "book_club_meeting.book_id": $db.book_club_meeting_book_id|min
        }
      }
    } as $book_club_meeting2
  }

  response = $books1
}