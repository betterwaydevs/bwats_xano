// Query all project_person_association records
query "association/project/{project_id}/all_people" verb=GET {
  api_group = "association"
  auth = "user"

  input {
    int stage_id?
    int project_id
    int per_page?
    int page?
  }

  stack {
    db.query stage {
      where = $db.stage.project_id == $input.project_id && $db.stage.limit_results
      return = {type: "list"}
      output = ["id"]
    } as $ignore_stages
  
    api.lambda {
      code = """
        const ignore_stages = $var.ignore_stages;
        
        if (!Array.isArray(ignore_stages)) {
            return [];
        }
        
        const id_array = ignore_stages.map(stage => stage.id);
        
        return id_array;
        """
      timeout = 10
    } as $ignore_stages
  
    db.query project_person_association {
      where = $db.project_person_association.project_id == $input.project_id
      sort = {project_person_association.updated_at: "desc"}
      return = {type: "list"}
      output = ["person_type", "elastic_search_id"]
    } as $model
  }

  response = $model
}