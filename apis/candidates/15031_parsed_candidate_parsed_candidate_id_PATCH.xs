query "parsed_candidate/{parsed_candidate_id}" verb=PATCH {
  api_group = "candidates"
  auth = "user"

  input {
    int parsed_candidate_id? filters=min:1
    dblink {
      table = "parsed_candidate"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.get parsed_candidate {
      field_name = "id"
      field_value = $input.parsed_candidate_id
    } as $existing_candidate
  
    precondition ($existing_candidate != null) {
      error_type = "notfound"
      error = "Parsed candidate not found"
    }
  
    var $patch_payload {
      value = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    }
  
    object.keys {
      value = $patch_payload
    } as $patch_payload_keys
  
    db.patch parsed_candidate {
      field_name = "id"
      field_value = $input.parsed_candidate_id
      data = $patch_payload
    } as $model
  
    conditional {
      if ($model != null && $model.elastic_search_document_id != null && $model.elastic_search_document_id != "" && $patch_payload_keys != null && $patch_payload_keys.count > 0) {
        cloud.elasticsearch.document {
          auth_type = "API Key"
          key_id = $env.es_key_id
          access_key = $env.es_access_key
          region = ""
          method = "GET"
          index = "candidates"
          doc_id = $model.elastic_search_document_id
          doc = {}
        } as $es_candidate
      
        precondition ($es_candidate != null && $es_candidate != 404) {
          error_type = "badrequest"
          error = "ElasticSearch document not found for candidate"
        }
      
        var $es_source {
          value = $es_candidate._source
        }
      
        precondition ($es_source != null) {
          error_type = "badrequest"
          error = "ElasticSearch document missing source payload"
        }
      
        api.lambda {
          code = """
              const source = $var.es_source;
              const updates = $var.patch_payload;
            
              const base = (source && typeof source === "object") ? { ...source } : {};
            
              if (updates && typeof updates === "object") {
                for (const [key, value] of Object.entries(updates)) {
                  base[key] = value;
                }
              }
            
              return base;
            """
          timeout = 1
        } as $es_updated_source
      
        cloud.elasticsearch.document {
          auth_type = "API Key"
          key_id = $env.es_key_id
          access_key = $env.es_access_key
          region = ""
          method = "PUT"
          index = "candidates"
          doc_id = $model.elastic_search_document_id
          doc = $es_updated_source
        } as $es_update
      }
    }
  
    conditional {
      if ($patch_payload_keys != null && $patch_payload_keys.count > 0) {
        api.lambda {
          code = """
              const rawKeys = $var.patch_payload_keys;
              const patchData = $var.patch_payload;
              const before = $var.existing_candidate;
              const after = $var.model;
            
              const keys = [];
            
              if (Array.isArray(rawKeys)) {
                rawKeys.forEach((item) => {
                  if (typeof item === "string") {
                    keys.push(item);
                    return;
                  }
            
                  if (item && typeof item === "object") {
                    if (typeof item.key === "string") {
                      keys.push(item.key);
                      return;
                    }
            
                    if (typeof item.name === "string") {
                      keys.push(item.name);
                    }
                  }
                });
              }
            
              if (keys.length === 0 && patchData && typeof patchData === "object") {
                keys.push(...Object.keys(patchData));
              }
            
              const uniqueKeys = Array.from(new Set(keys));
            
              const oldValues = {};
              const newValues = {};
            
              uniqueKeys.forEach((key) => {
                if (typeof key !== "string" || key.length === 0) {
                  return;
                }
            
                oldValues[key] = (before && Object.prototype.hasOwnProperty.call(before, key)) ? before[key] : null;
            
                if (after && Object.prototype.hasOwnProperty.call(after, key)) {
                  newValues[key] = after[key];
                } else if (patchData && Object.prototype.hasOwnProperty.call(patchData, key)) {
                  newValues[key] = patchData[key];
                } else {
                  newValues[key] = null;
                }
              });
            
              return {
                field_keys: uniqueKeys,
                old_values: oldValues,
                new_values: newValues
              };
            """
          timeout = 1
        } as $change_snapshot
      
        function.run log_change {
          input = {
            table_name        : "parsed_candidate"
            record_id         : $model.id
            field_keys        : $change_snapshot.field_keys
            old_values        : $change_snapshot.old_values
            new_values        : $change_snapshot.new_values
            changed_by_user_id: $auth.id
            context           : null
          }
        } as $change_log_entry
      }
    }
  }

  response = $model
}