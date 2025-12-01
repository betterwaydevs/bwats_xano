// Stores information about companies, including their names, visibility, and branding.
table company {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Timestamp when the company record was last updated.
    timestamp updated_at?
  
    // The official name of the company. Required and unique per workspace.
    text name? filters=trim
  
    // An optional friendly label for public display.
    text display_name? filters=trim
  
    // Controls whether the company appears anywhere externally. Defaults to TRUE.
    bool is_visible?
  
    // Rich text/HTML body for public display (stored as HTML, sanitized when rendered).
    text description_html? filters=trim
  
    image? logo?
    text website? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {type: "btree|unique", field: [{name: "name", op: "asc"}]}
  ]
}