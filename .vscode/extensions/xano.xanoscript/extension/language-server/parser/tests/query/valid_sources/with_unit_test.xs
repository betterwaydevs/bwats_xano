query list_applications verb=GET {
  description = "List adoption applications with optional filters (status, pet, user)"
  auth = "user"

  input {
    int id
    int? pet_id? { 
      table = "pet"
      description = "Filter by pet (optional)"
    }
  
    int? user_id? {
      table = "user"
      description = "Filter by applicant (optional)"
    }
  
    enum? status? {
      values = ["pending", "approved", "denied", "withdrawn", "completed"]
      description = "Filter by status (optional)"
    }
  
    int page?=1 {
      description = "Page number (default 1)"
    }
  
    int per_page?=20 {
      description = "Items per page (default 20)"
    }
  }

  stack {
    db.query adoption_application {
      where = $db.adoption_application.pet_id ==? $input.pet_id && $db.adoption_application.user_id ==? $input.user_id && $db.adoption_application.status ==? $input.status
      sort = {submitted_at: "desc"}
      return = {
        type  : "list"
        paging: {
          page    : $input.page
          per_page: $input.per_page
          totals  : true
        }
      }
    
      mock = { test: '{"foo":"bar"}'|json_decode }
    } as $applications
  }

  response = $applications
  history = "inherit"

  test test {
    datasource = "live"
    input = {
      pet_id  : null
      user_id : null
      status  : null
      page    : 1
      per_page: 20
    }
  
    expect.to_equal ($response.itemsReceived) {
      value = 7
    }
  
    expect.to_equal ($response.curPage) {
      value = 1
    }
  
    expect.to_equal ($response.nextPage) {
      value = null
    }
  
    expect.to_equal ($response.prevPage) {
      value = null
    }
  
    expect.to_equal ($response.offset) {
      value = 0
    }
  
    expect.to_equal ($response.perPage) {
      value = 20
    }
  
    expect.to_equal ($response.itemsTotal) {
      value = 7
    }
  
    expect.to_equal ($response.pageTotal) {
      value = 1
    }
  
    expect.to_equal ($response.items) {
      value = '[{"id":7,"pet_id":2,"user_id":2,"status":"pending","notes":"","submitted_at":1760221727254,"reviewed_at":0,"updated_at":1760221727254},{"id":6,"pet_id":1,"user_id":1,"status":"pending","notes":"","submitted_at":1760221727254,"reviewed_at":0,"updated_at":1760221727254},{"id":5,"pet_id":5,"user_id":5,"status":"completed","notes":"Shadow adopted successfully.","submitted_at":1759672800000,"reviewed_at":1759748400000,"updated_at":1760132298535},{"id":4,"pet_id":4,"user_id":4,"status":"withdrawn","notes":"Sunny\'s application withdrawn by user.","submitted_at":1759582800000,"reviewed_at":0,"updated_at":1760132298535},{"id":3,"pet_id":3,"user_id":3,"status":"denied","notes":"No suitable home for Thumper.","submitted_at":1759492800000,"reviewed_at":1759572000000,"updated_at":1760132298535},{"id":2,"pet_id":2,"user_id":2,"status":"approved","notes":"Carol\'s application for Mittens.","submitted_at":1759402800000,"reviewed_at":1759482000000,"updated_at":1760132298535},{"id":1,"pet_id":1,"user_id":1,"status":"pending","notes":"First application for Buddy.","submitted_at":1759312800000,"reviewed_at":0,"updated_at":1760132298535}]'|json_decode
    }
  }
}