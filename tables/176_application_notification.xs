// Manages notifications related to applications, including applicant details, project links, and status.
table application_notification {
  auth = false

  schema {
    int id
    text application_id? filters=trim
    int candidate_id?
    timestamp created_at?=now
  
    // The name of the applicant associated with the notification.
    text applicant_name? filters=trim
  
    // The email address of the applicant.
    email applicant_email? filters=trim|lower
  
    // The phone number of the applicant.
    text applicant_phone? filters=trim
  
    // Foreign key to the project this notification is associated with.
    int project_id? {
      table = "project"
    }
  
    // A URL relevant to the notification, such as an application link or video.
    text linked_url? filters=trim
  
    // The current status of the notification (e.g., pending, sent, failed, delivered, read).
    enum status? {
      values = ["pending", "read"]
    }
  
    attachment? resume?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}