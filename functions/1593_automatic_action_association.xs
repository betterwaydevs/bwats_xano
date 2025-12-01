function automatic_action_association {
  input {
    text linkedin_identifier? filters=trim
    enum action_type? {
      values = ["linkedin_invitation", "linkedin_connection"]
    }
  
    int user_id?
  }

  stack {
    precondition ($input.linkedin_identifier != null && $input.linkedin_identifier != "") {
      error = "linkedin_identifier is required"
    }
  
    precondition ($input.action_type != null && $input.action_type != "") {
      error = "action_type is required"
    }
  
    var $normalized_action {
      value = $input.action_type
    }
  
    var $identifier {
      value = $input.linkedin_identifier|trim
    }
  
    api.lambda {
      code = """
          const identifierInput = ($var.identifier || '').trim();
          if (!identifierInput) {
            return { slug: '', normalized_url: '' };
          }
        
          const trimTrailing = (value) => value.replace(/\/+$/, '');
          const stripQuery = (value) => value.split('?')[0].split('#')[0];
          const ensureProtocol = (value) => {
            if (!value.startsWith('http://') && !value.startsWith('https://')) {
              return `https://${value}`;
            }
            return value;
          };
        
          const lowerIdentifier = identifierInput.toLowerCase();
          let slug = lowerIdentifier;
          let normalizedUrl = identifierInput;
        
          if (lowerIdentifier.includes('linkedin.com')) {
            const withProtocol = ensureProtocol(identifierInput);
            const cleaned = stripQuery(trimTrailing(withProtocol));
            normalizedUrl = cleaned;
            slug = cleaned
              .toLowerCase()
              .replace(/^https?:\/\//, '')
              .replace(/^www\./, '')
              .replace(/^linkedin\.com\/(in|pub)\//, '')
              .replace(/\/+$/, '');
          } else {
            slug = stripQuery(trimTrailing(lowerIdentifier));
            normalizedUrl = `https://www.linkedin.com/in/${slug}`;
          }
        
          return {
            slug,
            normalized_url: normalizedUrl
          };
        """
      timeout = 10
    } as $normalized_linkedin
  
    precondition ($normalized_linkedin.slug != null && $normalized_linkedin.slug != "") {
      error = "Unable to derive LinkedIn slug from identifier"
    }
  
    db.query parsed_candidate {
      where = $db.parsed_candidate.linkedin_profile includes $normalized_linkedin.slug
      return = {type: "single"}
      output = [
        "id"
        "first_name"
        "last_name"
        "public_name"
        "linkedin_profile"
      ]
    } as $candidate_match
  
    db.query parsed_prospect {
      where = $db.parsed_prospect.linkedin_profile includes $normalized_linkedin.slug
      return = {type: "single"}
      output = [
        "id"
        "first_name"
        "last_name"
        "public_name"
        "linkedin_profile"
      ]
    } as $prospect_match
  
    precondition ($candidate_match != null || $prospect_match != null) {
      error = "No prospect or candidate found for the provided LinkedIn identifier"
    }
  
    var $people {
      value = []
    }
  
    var $stages_for_action {
      value = []
    }
  
    conditional {
      if ($candidate_match != null) {
        array.push $people {
          value = {
            person_type     : "candidate"
            person_id       : $candidate_match.id
            first_name      : $candidate_match.first_name
            last_name       : $candidate_match.last_name
            public_name     : $candidate_match.public_name
            linkedin_profile: $candidate_match.linkedin_profile
          }
        }
      }
    }
  
    conditional {
      if ($prospect_match != null) {
        array.push $people {
          value = {
            person_type     : "prospect"
            person_id       : $prospect_match.id
            first_name      : $prospect_match.first_name
            last_name       : $prospect_match.last_name
            public_name     : $prospect_match.public_name
            linkedin_profile: $prospect_match.linkedin_profile
          }
        }
      }
    }
  
    foreach ($people) {
      each as $person {
        db.query project_person_association {
          where = $db.project_person_association.person_id == $person.person_id && $db.project_person_association.person_type == $person.person_type
          return = {type: "list"}
          output = ["id", "project_id", "person_id", "person_type"]
        } as $associations
      
        conditional {
          if ($associations == null || $associations.count == 0) {
            continue
          }
        }
      
        foreach ($associations) {
          each as $association {
            var $target_stage_type {
              value = "candidates"
            }
          
            conditional {
              if ($association.person_type == "prospect") {
                var.update $target_stage_type {
                  value = "prospects"
                }
              }
            }
          
            db.query stage {
              where = $db.stage.project_id == $association.project_id && $db.stage.stage_action == $normalized_action && $db.stage.stage_type == $target_stage_type
              sort = {stage.sort_order: "asc"}
              return = {type: "list"}
              output = [
                "id"
                "name"
                "project_id"
                "stage_type"
                "stage_action"
                "sort_order"
              ]
            } as $matching_stages
          
            conditional {
              if ($matching_stages == null || $matching_stages.count == 0) {
                continue
              }
            }
          
            foreach ($matching_stages) {
              each as $stage_item {
                function.run association_project_change_stage {
                  input = {
                    project_person_association_id: $association.id
                    notes                        : "Automatic Association Change"
                    activity_type                : "stage_change"
                    stage_id                     : $stage_item.id
                  }
                } as $association_update
              
                array.push $stages_for_action {
                  value = `$association_update`
                }
              }
            }
          }
        }
      }
    }
  }

  response = $stages_for_action
}