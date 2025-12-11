// Get project record
query "project/{project_id}/initialize-stages" verb=GET {
  auth = "user"

  input {
    int project_id? filters=min:1
    text stage_type? filters=trim|lower
  }

  stack {
    conditional {
      if ($input.stage_type == "candidates") {
        api.lambda {
          code = """
              const stages = [
                {
                  name: "Cultural and Tech Fit - BWDevs",
                  sort_order: 1,
                  is_terminal: false,
                  stage_action: "none"
                },
                {
                  name: "Technical Pre Validation - BWDevs",
                  sort_order: 2,
                  is_terminal: false,
                  stage_action: "none"
                },
                {
                  name: "Discarded by BWDevs",
                  sort_order: 3,
                  is_terminal: false,
                  limit_results: false,
                  stage_action: "none"
                },
                {
                  name: "Presented",
                  sort_order: 4,
                  is_terminal: false,
                  stage_action: "none"
                },
                {
                  name: "First Company Interview",
                  sort_order: 5,
                  is_terminal: false,
                  stage_action: "none"
                },
                {
                  name: "Second Company Interview",
                  sort_order: 6,
                  is_terminal: false,
                  stage_action: "none"
                },
                {
                  name: "Discarded",
                  sort_order: 7,
                  is_terminal: false,
                  limit_results: false,
                  stage_action: "none"
                },
                {
                  name: "Offered",
                  sort_order: 8,
                  is_terminal: false,
                  stage_action: "none"
                },
                {
                  name: "Hired",
                  sort_order: 9,
                  is_terminal: true,
                  stage_action: "none"
                }
              ];
            
              return stages.map((stage) => ({
                project_id: $input.project_id,
                stage_type: "candidates",
                ...stage
              }));
            """
          timeout = 10
        } as $stages
      }
    
      else {
        api.lambda {
          code = """
              const stages = [
                {
                  name: "Pre Selected",
                  sort_order: 1,
                  is_terminal: false,
                  stage_action: "none"
                },
                {
                  name: "Invited",
                  sort_order: 2,
                  is_terminal: false,
                  stage_action: "linkedin_invitation"
                },
                {
                  name: "Contacted",
                  sort_order: 3,
                  is_terminal: false,
                  stage_action: "linkedin_connection"
                },
                {
                  name: "Interested",
                  sort_order: 4,
                  is_terminal: false,
                  stage_action: "none"
                },
                {
                  name: "Not Interested",
                  sort_order: 5,
                  is_terminal: false,
                  limit_results: true,
                  stage_action: "none"
                },
                {
                  name: "Discarded",
                  sort_order: 6,
                  is_terminal: false,
                  limit_results: true,
                  stage_action: "none"
                },
                {
                  name: "Applied",
                  sort_order: 7,
                  is_terminal: true,
                  stage_action: "none"
                }
              ];
            
              return stages.map((stage) => ({
                project_id: $input.project_id,
                stage_type: "prospects",
                ...stage
              }));
            """
          timeout = 10
        } as $stages
      }
    }
  
    db.bulk.add stage {
      allow_id_field = false
      items = $stages
    } as $model
  
    db.query stage {
      where = $db.stage.project_id == $input.project_id
      sort = {stage.sort_order: "asc"}
      return = {type: "list"}
    } as $inserted_stages
  
    precondition ($inserted_stages != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $inserted_stages
}