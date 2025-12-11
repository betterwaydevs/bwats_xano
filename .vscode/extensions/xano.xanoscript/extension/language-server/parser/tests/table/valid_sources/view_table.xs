table Products {
  auth = false

  schema {
    int id
    timestamp created_at?=now
    int supplier_id? {
      table = "Organizations"
    }
  
    text? name?
    vector? name_vector? {
      size = 1536
    }
    bool hide?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "vector"
      field: [{name: "name_vector", op: "vector_ip_ops"}]
    }
    {type: "btree", field: [{name: "supplier_id", op: "asc"}]}
    {
      type : "btree"
      field: [
        {name: "product_category_id", op: "asc"}
        {name: "supplier_id", op: "asc"}
      ]
    }
    {
      type : "btree"
      field: [{name: "owner_organization_id", op: "asc"}]
    }
    {
      type : "btree"
      field: [
        {name: "owner_organization_id", op: "asc"}
        {name: "supplier_id", op: "asc"}
      ]
    }
  ]

  view = {
    "my view": {
      sort: {id: "asc"}
      hide: ["created_at"]
      id  : "5f6573ca-75f6-4025-bdbc-9ab47c558a5c"
    }
    view_1: {
      sort: {id: "asc"}
      hide: [
        "created_at"
        "supplier_id"
      ]
      id  : "a1e5b116-9f82-4ae4-aa64-eac6cd14154e"
    }
  }
}