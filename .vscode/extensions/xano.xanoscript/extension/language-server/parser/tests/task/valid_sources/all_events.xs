task "list dogs" {
  stack {
    db.query client {
      description = "Some description"
    } as $clients
  }

  schedule = [
      {starts_on: 2025-03-17 18:33:50+0000}
      {starts_on: 2025-03-17 18:33:55+0000, freq: 172800}
      {
        starts_on: 2025-03-17 18:34:02+0000,
        freq     : 604800,
        ends_on  : 2029-03-15 18:34:02+0000
      }
    ]
}