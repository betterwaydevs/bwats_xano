// List donations with optional filters (donor, campaign, date range)
query list_donations verb=GET {
  auth = "user"

  input {
    // Filter by donor (optional)
    int? donor_id? {
      table = "user"
    }
  
    // Filter by campaign (optional)
    text? campaign? filters=trim
  
    // Donations after this date (optional)
    timestamp? donated_after?
  
    // Donations before this date (optional)
    timestamp? donated_before?
  
    // Page number (default 1)
    int page?=1
  
    // Items per page (default 20)
    int per_page?=20
  }

  stack {
    var $error_foo {
      value = "bar"
    }

    db.query donation {
      where = $db.donation.donor_id ==? $input.donor_id && $db.donation.campaign ==? $input.campaign && $db.donation.donated_at >=? $input.donated_after && $db.donation.donated_at <=? $input.donated_before
      sort = {donated_at: "desc"}
      return = {
        type  : "list"
        paging: {
          page    : $input.page
          per_page: $input.per_page
          totals  : true
        }
      }
    } as $donations
  
    try_catch {
      try {
        db.get non_existent_table {
          field_name = "id"
          field_value = 1
        } as $should_fail
      }
      catch {
        var $x1 {
          value = $error.message
        }
        db.get non_existent_table {
          field_name = "id"
          field_value = $error.message
        } as $should_fail
      }
    }
  }

  response = $donations
}