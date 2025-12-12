// Query all project records
query project verb=GET {
  api_group = "association"

  input {
    enum? status? {
      values = ["active", "closed"]
    }
  }

  stack {
    db.query project {
      where = $db.project.status ==? $input.status
      sort = {project.company_id: "asc", project.name: "asc"}
      return = {type: "list"}
      output = []
      addon = [
        {
          name : "company"
          input: {company_id: $output.company_id}
          as   : "_company"
        }
      ]
    } as $model
  }

  response = $model
}