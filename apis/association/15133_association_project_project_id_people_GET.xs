// Query all project_person_association records
query "association/project/{project_id}/people" verb=GET {
  api_group = "association"
  auth = "user"

  input {
    int stage_id?
    int project_id
    int per_page?
    int page?
    enum stage_type?=prospects {
      values = ["prospects", "candidates"]
    }
  }

  stack {
    conditional {
      if ($input.stage_id == 0) {
        db.query stage {
          where = $db.stage.project_id == $input.project_id && $db.stage.limit_results && $db.stage.stage_type == $input.stage_type
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
          join = {
            stage: {
              table: "stage"
              type : "left"
              where: $db.project_person_association.current_stage_id == $db.stage.id
            }
          }
        
          where = $db.project_person_association.project_id == $input.project_id && $db.project_person_association.current_stage_id not in? $ignore_stages && $db.stage.stage_type == $input.stage_type
          sort = {project_person_association.updated_at: "desc"}
          return = {type: "list"}
          output = [
            "id"
            "created_at"
            "project_id"
            "person_id"
            "person_type"
            "current_stage_id"
            "updated_at"
            "added_by_user_id"
            "elastic_search_id"
            "last_note"
          ]
        
          addon = [
            {
              name : "user"
              input: {user_id: $output.added_by_user_id}
              as   : "_user"
            }
          ]
        } as $model
      }
    
      else {
        db.query project_person_association {
          join = {
            stage: {
              table: "stage"
              type : "left"
              where: $db.project_person_association.current_stage_id == $db.stage.id
            }
          }
        
          where = $db.project_person_association.project_id == $input.project_id && $db.project_person_association.current_stage_id == $input.stage_id && $db.stage.stage_type == $input.stage_type
          sort = {project_person_association.updated_at: "desc"}
          return = {
            type  : "list"
            paging: {
              page    : $input.page
              per_page: $input.per_page
              totals  : true
            }
          }
        
          addon = [
            {
              name : "user"
              input: {user_id: $output.added_by_user_id}
              as   : "items._user"
            }
          ]
        } as $model
      }
    }
  
    api.lambda {
      code = """
        const model = $var.model;
        const response = {
          items_count  : 0,
          prospect_ids : [],
          candidate_ids: []
        };
        
        if (!model) {
            return response;
        }
        
        let items = [];
        
        if (Array.isArray(model)) {
            items = model;
        } else if (Array.isArray(model.items)) {
            items = model.items;
        }
        
        const unique = (list) => Array.from(new Set(list.filter((value) => value !== null && value !== undefined)));
        
        items.forEach((association) => {
            if (!association || association.person_id == null) {
                return;
            }
        
            if (association.person_type === "prospect") {
                response.prospect_ids.push(association.person_id);
            } else if (association.person_type === "candidate") {
                response.candidate_ids.push(association.person_id);
            }
        });
        
        response.prospect_ids  = unique(response.prospect_ids);
        response.candidate_ids = unique(response.candidate_ids);
        response.items_count   = items.length;
        
        return response;
        """
      timeout = 10
    } as $associations_meta
  
    conditional {
      if ($associations_meta.items_count > 0) {
        db.query person_activity_history {
          where = $db.person_activity_history.activity_type in? ["linkedin_invitation_sent", "linkedin_message", "email_sent", "whatsapp_message", "phone_call", "other_contact"] && (($db.person_activity_history.person_type == "prospect" && $db.person_activity_history.person_id in? $associations_meta.prospect_ids) || ($db.person_activity_history.person_type == "candidate" && $db.person_activity_history.person_id in? $associations_meta.candidate_ids))
          sort = {person_activity_history.created_at: "desc"}
          return = {type: "list"}
          output = [
            "id"
            "created_at"
            "person_id"
            "person_type"
            "activity_type"
            "person_name"
            "project_id"
            "project_name"
            "created_by_user_id"
            "created_by_user_name"
            "note"
          ]
        } as $touchpoints
      }
    }
  
    api.lambda {
      code = """
        const model = $var.model;
        const touchpoints = Array.isArray($var.touchpoints) ? $var.touchpoints : [];
        
        if (!model) {
            return model;
        }
        
        const group = {};
        
        touchpoints.forEach((entry) => {
            if (!entry) {
                return;
            }
        
            const key = `${entry.person_type}:${entry.person_id}`;
        
            if (!group[key]) {
                group[key] = [];
            }
        
            group[key].push(entry);
        });
        
        const attach = (association) => {
            if (!association) {
                return;
            }
        
            const key = `${association.person_type}:${association.person_id}`;
            association.touchpoints = group[key] || [];
        };
        
        if (Array.isArray(model)) {
            model.forEach(attach);
            return model;
        }
        
        if (model && Array.isArray(model.items)) {
            model.items.forEach(attach);
        }
        
        return model;
        """
      timeout = 10
    } as $model
  }

  response = $model
}