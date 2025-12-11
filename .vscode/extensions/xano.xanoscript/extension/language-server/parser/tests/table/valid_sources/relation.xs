table beer {
  auth = false
  schema {
    int id {
      description = "Unique identifier for the beer"
    }
  
    timestamp created_at?=now {
      description = "Timestamp when the beer was added"
    }
  
    text name? {
      description = "Name of the beer"
    }
  
    text style? {
      description = "Style or category of the beer (e.g., IPA, Lager)"
    }
  
    decimal abv? {
      description = "Alcohol by volume percentage of the beer"
    }
  
    int ibu? {
      description = "International Bitterness Units (IBU) of the beer"
    }
  
    text description? {
      description = "Optional description or notes about the beer"
    }
  
    int brewery_id? {
      table = "brewery"
      description = "Identifier for the brewery that produces the beer"
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

}