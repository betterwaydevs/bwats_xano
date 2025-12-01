table remoteweekly_leads {
  auth = false

  schema {
    int id
    timestamp created_at?
    text uid? filters=trim
    text title? filters=trim
    text lead? filters=trim
    text companyName? filters=trim
    text location? filters=trim
    text categories? filters=trim
    text labels? filters=trim
    text link_list? filters=trim
    text link_detail? filters=trim
    date? posted_at?
    text created_at_rw? filters=trim
    bool exported?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "uid", op: "desc"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree|unique", field: [{name: "uid", op: "asc"}]}
  ]

  view = {
    "not exported": {
      search: $db.exported == "false"
      sort  : {id: "asc"}
      id    : "62334aeb-33d1-47d4-9e48-bbd1501ab4dc"
    }
  }
}