function prospect_quick_normalize_skills {
  input {
    int prospect_id? filters=min:1
  }

  stack {
    db.get parsed_prospect {
      field_name = "id"
      field_value = $input.prospect_id
      output = ["id", "skills", "elastic_search_document_id"]
    } as $prospect_record
  
    precondition ($prospect_record != null) {
      error_type = "notfound"
      error = "Parsed prospect not found"
      payload = $prospect_record.skills
    }
  
    api.lambda {
      code = """
          const record = $var.prospect_record;
          return Array.isArray(record?.skills) ? record.skills : [];
        """
      timeout = 1
    } as $skills
  
    var $result {
      value = {
        prospect_id            : $prospect_record.id
        original_skills        : $prospect_record.skills
        normalized_skills      : null
        normalization_attempted: false
        normalization_success  : false
        database_updated       : false
        elastic_attempted      : false
        elastic_updated        : false
        message                : "Prospect has no skills to normalize."
      }
    }
  
    conditional {
      if (($skills|count) > 0) {
        var.update $result {
          value = $result
            |set:"normalization_attempted":true
            |set:"message":"Normalizing skills."
        }
      
        function.run get_open_api_parser_prompt {
          input = {prompt_type: "skill_normalization"}
        } as $prompt_base
      
        api.lambda {
          code = """
              const prompt = $var.prompt_base;
              const skills = $var.skills;
            
              if (typeof prompt !== "string" || prompt.trim().length === 0) {
                return null;
              }
            
              let serialized = "";
            
              if (Array.isArray(skills) && skills.length > 0) {
                const json = JSON.stringify(skills);
            
                serialized = json.slice(1, -1); // drop leading and trailing brackets
              }
            
              return serialized.length > 0
                ? `${prompt}\n${serialized}`
                : `${prompt}\n{}`;
            """
          timeout = 1
        } as $prompt_payload
      
        precondition ($prompt_payload != null && $prompt_payload != "") {
          error = "Failed to build normalization prompt"
        }
      
        function.run call_open_ia {
          input = {prompt: $prompt_payload, openai_file_id: ""}
        } as $raw_response|get:0:null
      
        precondition ($raw_response != null && $raw_response != "") {
          error = "Normalization response was empty"
        }
      
        api.lambda {
          code = """
              const raw = $var.raw_response;
            
              const toString = (value) => {
                if (typeof value === "string") {
                  return value;
                }
            
                if (value === null || value === undefined) {
                  return "";
                }
            
                try {
                  return JSON.stringify(value);
                } catch (error) {
                  return String(value);
                } 
              };
            
              const stripCodeFence = (text) => {
                if (!text.startsWith("```") && !text.endsWith("```")) {
                  return text;
                }
            
                return text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
              };
            
              const extractJson = (text) => {
                const first = Math.min(
                  ...[text.indexOf("{"), text.indexOf("[")].filter((idx) => idx >= 0)
                );
            
                if (!Number.isFinite(first) || first < 0) {
                  return null;
                }
            
                const last = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
            
                if (last <= first) {
                  return text.slice(first);
                }
            
                return text.slice(first, last + 1);
              };
            
              const fallbackArray = (text) => {
                const matches = text.match(/\{[^{}]*\}/g);
            
                if (!matches || matches.length === 0) {
                  return null;
                }
            
                try {
                  return JSON.parse(`[${matches.join(",")}]`);
                } catch (error) {
                  return null;
                }
              };
            
              const parseArray = (value) => {
                if (Array.isArray(value)) {
                  return value;
                }
            
            
                const rawText = stripCodeFence(toString(value).trim());
                if (!rawText) {
                  return null;
                }
            
                const jsonText = extractJson(rawText) || rawText;
            
                try {
                  return JSON.parse(jsonText);
                } catch (error) {
                  return fallbackArray(rawText);
                }
              };
            
              const flatten = (input) => {
                if (!Array.isArray(input)) {
                  return [];
                }
            
                const queue = [...input];
                const result = [];
            
                while (queue.length > 0) {
                  const current = queue.shift();
            
                  if (Array.isArray(current)) {
                    queue.unshift(...current);
                    continue;
                  }
            
                  result.push(current);
                }
            
                return result;
              };
            
              const parsedValue = parseArray(raw);
            
              if (parsedValue === null) {
                return null;
              }
            
              let normalizedArray = [];
            
              if (Array.isArray(parsedValue)) {
                normalizedArray = flatten(parsedValue);
              }
            
              else if (parsedValue && typeof parsedValue === "object") {
                if (Array.isArray(parsedValue.skills)) {
                  normalizedArray = flatten(parsedValue.skills);
                }
            
                else {
                  normalizedArray = [parsedValue];
                }
              }
            
              else {
                normalizedArray = [];  
              }
            
              const toObject = (value) => {
                if (value && typeof value === "object") {
                  return value;
                }
            
                if (typeof value !== "string") {
                  return null;
                }
            
                const trimmed = value.trim();
                if (!trimmed) {
                  return null;
                }
            
                try {
                  return JSON.parse(trimmed);
                } catch (error) {
                  const jsonSegment = extractJson(trimmed);
                  if (!jsonSegment) {
                    return null;
                  }
            
                  try {
                    return JSON.parse(jsonSegment);
                  } catch (innerError) {
                    return null;
                  }
                }
              };
            
              const cleaned = normalizedArray
                .map(toObject)
                .filter((item) => item && typeof item === "object")
                .map((item) => {
                  const name = typeof item.skill === "string" ? item.skill.trim() : "";
                  if (!name) {
                    return null;
                  }
            
                  let months = item.months_experience;
                  months = Number.isFinite(months) ? months : parseFloat(months);
                  months = Number.isFinite(months) ? Math.max(0, Math.round(months)) : 0;
            
                  const lastUsed = typeof item.last_used === "string" && item.last_used.trim().length > 0
                    ? item.last_used.trim()
                    : null;
            
                  return {
                    skill: name,
                    months_experience: months,
                    last_used: lastUsed
                  };
                })
                .filter(Boolean);
            
              if (cleaned.length === 0) {
                return null;
              }
            
              return cleaned;
            """
          timeout = 1
        } as $normalized
      
        precondition ($normalized != null && ($normalized|count) > 0) {
          error = "Normalization response did not include skills"
        }
      
        var.update $result {
          value = $result
            |set:"normalized_skills":$normalized
            |set:"normalization_success":true
            |set:"message":"Skills normalized successfully."
        }
      
        db.patch parsed_prospect {
          field_name = "id"
          field_value = $prospect_record.id
          data = {skills: $normalized, is_quick_normalized: true}
        } as $updated
      
        var.update $result {
          value = $result
            |set:"database_updated":($updated != null)
        }
      
        conditional {
          if ($prospect_record.elastic_search_document_id != null && $prospect_record.elastic_search_document_id != "") {
            var.update $result {
              value = $result|set:"elastic_attempted":true
            }
          
            cloud.elasticsearch.document {
              auth_type = "API Key"
              key_id = $env.es_key_id
              access_key = $env.es_access_key
              region = ""
              method = "GET"
              index = "prospects"
              doc_id = $prospect_record.elastic_search_document_id
              doc = {}
            } as $es_doc
          
            precondition ($es_doc != null && $es_doc != 404) {
              error_type = "badrequest"
              error = "ElasticSearch document not found for prospect"
            }
          
            precondition ($es_doc._source != null) {
              error_type = "badrequest"
              error = "ElasticSearch document missing source payload"
            }
          
            api.lambda {
              code = """
                  const source = $var.es_doc._source;
                  const skills = $var.normalized;
                  const merged = (source && typeof source === "object") ? { ...source } : {};
                  merged.skills = skills;
                  return merged;
                """
              timeout = 1
            } as $es_payload
          
            cloud.elasticsearch.document {
              auth_type = "API Key"
              key_id = $env.es_key_id
              access_key = $env.es_access_key
              region = ""
              method = "PUT"
              index = "prospects"
              doc_id = $prospect_record.elastic_search_document_id
              doc = $es_payload
            } as $es_update
          
            var.update $result {
              value = $result
                |set:"elastic_updated":($es_update != null && $es_update.result != null)
            }
          }
        }
      }
    }
  
    api.lambda {
      code = """
          const result = $var.result || {};
          const attempted = Boolean(result.normalization_attempted);
          const success = Boolean(result.normalization_success);
          const db = Boolean(result.database_updated);
          const elastic = result.elastic_attempted ? Boolean(result.elastic_updated) : true;
          return attempted ? (success && db && elastic) : false;
        """
      timeout = 1
    } as $overall
  
    var.update $result {
      value = $result|set:"overall_success":$overall
    }
  }

  response = $result
}