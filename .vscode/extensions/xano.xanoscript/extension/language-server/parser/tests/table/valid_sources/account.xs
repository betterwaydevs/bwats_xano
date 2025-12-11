table accounts {
  description = "Stores account information for B2B SaaS."
  schema {
    int id {
      description = "Primary key for the account."
    }
    text name filters=trim {
      description = "Name of the account."
    }
    text industry? filters=trim {
      description = "Industry of the account (optional)."
    }
    text location? filters=trim {
      description = "Location of the account (optional)."
    }
    timestamp created_at?=now {
      description = "Timestamp when the account was created."
    }
    timestamp updated_at?=now {
      description = "Timestamp when the account was last updated."
    }
    timestamp deleted_at? {
      description = "Timestamp when the account was deleted (soft delete)."
    }
  }
  index = [
    {type: "primary", field: [{name: "id"}]},
    {type: "btree", field: [{name: "name", op: "asc"}]},
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}
