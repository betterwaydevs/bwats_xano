query "candidate/parse_from_resume" verb=POST {
  auth = "user"

  input {
    int candidate_id? filters=min:1
    int attachment_id? filters=min:1
  }

  stack {
    // 1. Validate input and load candidate + attachment
    group {
      stack {
        precondition ($input.candidate_id != null) {
          error_type = "inputerror"
          error = "candidate_id is required"
        }
      
        precondition ($input.attachment_id != null) {
          error_type = "inputerror"
          error = "attachment_id is required"
        }
      
        db.get parsed_candidate {
          field_name = "id"
          field_value = $input.candidate_id
        } as $candidate
      
        precondition ($candidate != null) {
          error_type = "notfound"
          error = "Candidate not found"
        }
      
        db.get person_attachment {
          field_name = "id"
          field_value = $input.attachment_id
        } as $attachment_record
      
        precondition ($attachment_record != null) {
          error_type = "notfound"
          error = "Attachment not found"
        }
      
        precondition ($attachment_record.person_id == $input.candidate_id && $attachment_record.person_type == "candidate") {
          error_type = "inputerror"
          error = "Attachment does not belong to candidate"
        }
      
        precondition ($attachment_record.attachment != null) {
          error_type = "inputerror"
          error = "Attachment missing storage metadata"
        }
      
        var $openai_file_id {
          value = $attachment_record|get:"openia_file_id"
        }
      }
    }
  
    // 2. Ensure resume uploaded to OpenAI & capture signed URL
    group {
      stack {
        var $resume_url {
          value = null
        }
      
        var $file_upload_status {
          value = {
            attempted: false
            uploaded : false
            reused   : false
            error    : null
          }
        }
      
        conditional {
          if ($openai_file_id == null || $openai_file_id == "") {
            conditional {
              if ($attachment_record.attachment.access == "private") {
                storage.sign_private_url {
                  pathname = $attachment_record.attachment.path
                  ttl = 600
                } as $signed_url
              
                var.update $resume_url {
                  value = $signed_url
                }
              }
            
              else {
                var.update $resume_url {
                  value = $attachment_record.attachment.url
                }
              }
            }
          
            precondition ($resume_url != null && $resume_url != "") {
              error = "Unable to sign attachment URL"
            }
          
            var.update $file_upload_status {
              value = $file_upload_status|set:"attempted":true
            }
          
            function.run upload_file_open_ia {
              input = {file_url: $resume_url}
            } as $upload_result
          
            precondition ($upload_result.file_id != null && $upload_result.file_id != "") {
              error = "Failed to upload resume to OpenAI"
            }
          
            var.update $openai_file_id {
              value = $upload_result.file_id
            }
          
            var.update $file_upload_status {
              value = $file_upload_status
                |set:"uploaded":true
                |set:"reused":false
                |set:"error":null
            }
          
            db.patch person_attachment {
              field_name = "id"
              field_value = $attachment_record.id
              data = {openia_file_id: $openai_file_id}
            } as $attachment_update
          }
        
          else {
            var.update $file_upload_status {
              value = $file_upload_status
                |set:"attempted":false
                |set:"uploaded":false
                |set:"reused":true
                |set:"error":null
            }
          }
        }
      }
    }
  
    // 3. Build assistant prompt, call OpenAI, and prep updates
    group {
      stack {
        function.run get_open_api_parser_prompt as $parser_prompt
        function.run call_open_ia {
          input = {prompt: $parser_prompt, openai_file_id: $openai_file_id}
        } as $assistant_output
      
        precondition ($assistant_output != null && $assistant_output != "") {
          error = "Assistant response was empty"
        }
      
        var $candidate_update_keys {
          value = []
        }
      
        var $candidate_update {
          value = null
        }
      
        var $candidate_update_payload {
          value = {}
        }
      
        var $candidate_update_status {
          value = null
        }
      
        var $database_update_status {
          value = {attempted: false, updated: false, error: null}
        }
      
        var $elastic_update_status {
          value = {attempted: false, updated: false, error: null}
        }
      
        api.lambda {
          code = """
              const rawAssistant = $var.assistant_output;
            
              if (rawAssistant === null || rawAssistant === undefined) {
                throw new Error("Assistant output missing");
              }
            
              const parseJson = (value) => {
                if (typeof value !== "string") {
                  return value;
                }
            
                const trimmed = value.trim();
                if (!trimmed) {
                  throw new Error("Assistant output empty after trim");
                }
            
                if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
                  throw new Error("Assistant output did not yield a JSON object");
                }
            
                try {
                  return JSON.parse(trimmed);
                } catch (error) {
                  throw new Error(`Failed to parse assistant JSON: ${error.message}`);
                }
              };
            
              const ensureObject = (value) => {
                let parsed = value;
            
                while (typeof parsed === "string") {
                  parsed = parseJson(parsed);
                }
            
                if (Array.isArray(parsed)) {
                  if (parsed.length === 0) {
                    throw new Error("Assistant output array was empty");
                  }
            
                  parsed = parsed[0];
                  return ensureObject(parsed);
                }
            
                if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                  throw new Error("Assistant output did not yield an object");
                }
            
                return parsed;
              };
            
              const parsed = ensureObject(rawAssistant);
              const numericKeys = new Set(["total_experience_years", "salary_aspiration"]);
            
              const sanitized = {};
            
              for (const [key, valueRaw] of Object.entries(parsed)) {
                if (valueRaw === null || valueRaw === undefined) {
                  continue;
                }
            
                if (Array.isArray(valueRaw)) {
                  if (valueRaw.length === 0) {
                    continue;
                  }
            
                  sanitized[key] = valueRaw;
                  continue;
                }
            
                if (typeof valueRaw === "string") {
                  const trimmed = valueRaw.trim();
                  if (!trimmed) {
                    continue;
                  }
            
                  if (key === "email") {
                    sanitized[key] = trimmed.toLowerCase();
                    continue;
                  }
            
                  if (key === "linkedin_profile") {
                    const normalized = trimmed.replace(/\/$/, "");
                    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+$/i;
            
                    if (!linkedinPattern.test(normalized)) {
                      continue;
                    }
            
                    sanitized[key] = normalized;
                    continue;
                  }
            
                  if (numericKeys.has(key)) {
                    const isNumericLike = /^-?\d+(\.\d+)?$/.test(trimmed);
                    if (!isNumericLike) {
                      continue;
                    }
            
                    const numericValue = parseFloat(trimmed);
                    if (!Number.isFinite(numericValue)) {
                      continue;
                    }
            
                    sanitized[key] = numericValue;
                    continue;
                  }
            
                  sanitized[key] = trimmed;
                  continue;
                }
            
                if (typeof valueRaw === "number" && Number.isFinite(valueRaw)) {
                  sanitized[key] = valueRaw;
                  continue;
                }
            
                if (typeof valueRaw === "boolean") {
                  sanitized[key] = valueRaw;
                  continue;
                }
            
                if (typeof valueRaw === "object" && !Array.isArray(valueRaw) && Object.keys(valueRaw).length > 0) {
                  sanitized[key] = valueRaw;
                }
              }
            
              const keys = Object.keys(sanitized);
            
              return {
                sanitized,
                parsed    : sanitized,
                key_count : keys.length
              };
            """
          timeout = 1
        } as $candidate_field_mapper
      
        conditional {
          if ($candidate_field_mapper.key_count != null && $candidate_field_mapper.key_count > 0) {
            var.update $candidate_update_payload {
              value = $candidate_field_mapper.sanitized
            }
          
            function.run get_open_api_parser_prompt {
              input = {prompt_type: "skill_normalization"}
            } as $parser_prompt
          
            api.lambda {
              code = """
                  const prompt = $var.parser_prompt;
                  const payload = $var.candidate_update_payload || {};
                  const skills = payload.skills;
                
                  if (!Array.isArray(skills) || skills.length === 0) {
                    return null;
                  }
                
                  const serialized = JSON.stringify({ skills });
                
                  return `${prompt}\n${serialized}`;
                """
              timeout = 1
            } as $parser_prompt
          
            conditional {
              if ($parser_prompt != null && $parser_prompt != "") {
                function.run call_open_ia {
                  input = {prompt: $parser_prompt}
                } as $normalization_response
              
                api.lambda {
                  code = """
                      const payload = $var.candidate_update_payload || {};
                      let normalized = $var.normalization_response;
                    
                      if (normalized === null || normalized === undefined) {
                        return payload;
                      }
                    
                      if (typeof normalized === "string") {
                        const trimmed = normalized.trim();
                    
                        if (!trimmed) {
                          return payload;
                        }
                    
                        try {
                          normalized = JSON.parse(trimmed);
                        } catch (error) {
                          return payload;
                        }
                      }
                    
                      if (Array.isArray(normalized) && normalized.length === 1 && Array.isArray(normalized[0])) {
                        normalized = normalized[0];
                      }
                    
                      if (!Array.isArray(normalized)) {
                        return payload;
                      }
                    
                      const cleaned = normalized
                        .filter((item) => item && typeof item === "object" && !Array.isArray(item))
                        .map((item) => {
                          const skill = typeof item.skill === "string" ? item.skill.trim() : "";
                          if (!skill) {
                            return null;
                          }
                    
                          const monthsRaw = item.months_experience;
                          const months = Number.isFinite(monthsRaw)
                            ? monthsRaw
                            : Number.isFinite(parseFloat(monthsRaw))
                              ? parseFloat(monthsRaw)
                              : 0;
                    
                          const lastUsed = typeof item.last_used === "string" && item.last_used.trim()
                            ? item.last_used.trim()
                            : null;
                    
                          return {
                            skill,
                            months_experience: months,
                            last_used: lastUsed
                          };
                        })
                        .filter(Boolean);
                    
                      if (cleaned.length === 0) {
                        return payload;
                      }
                    
                      return Object.assign({}, payload, { skills: cleaned });
                    """
                  timeout = 1
                } as $candidate_update_payload
              
                var.update $candidate_field_mapper {
                  value = $candidate_field_mapper
                    |set:"sanitized":$candidate_update_payload
                }
              }
            }
          
            db.patch parsed_candidate {
              field_name = "id"
              field_value = $candidate.id
              data = $candidate_update_payload
            } as $candidate_update
          
            var.update $database_update_status {
              value = $database_update_status
                |set:"attempted":true
                |set:"updated":($candidate_update != null)
            }
          
            object.keys {
              value = $candidate_update_payload
            } as $candidate_update_keys
          
            api.lambda {
              code = """
                  const payload = $var.candidate_update_payload || {};
                  const updated = $var.candidate_update || {};
                
                  const isMeaningful = (value) => {
                    if (value === null || value === undefined) {
                      return false;
                    }
                
                    if (typeof value === "string") {
                      return value.trim().length > 0;
                    }
                
                    if (Array.isArray(value)) {
                      return value.length > 0;
                    }
                
                    if (typeof value === "number") {
                      return Number.isFinite(value);
                    }
                
                    if (typeof value === "boolean") {
                      return true;
                    }
                
                    if (typeof value === "object") {
                      return Object.keys(value).length > 0;
                    }
                
                    return false;
                  };
                
                  const meaningfulKeys = [];
                  const missingKeys = [];
                
                  for (const [key, value] of Object.entries(payload)) {
                    if (!isMeaningful(value)) {
                      continue;
                    }
                
                    meaningfulKeys.push(key);
                
                    const updatedValue = updated ? updated[key] : undefined;
                
                    if (!isMeaningful(updatedValue)) {
                      missingKeys.push(key);
                    }
                  }
                
                  const persistedKeys = meaningfulKeys.filter((key) => !missingKeys.includes(key));
                
                  return {
                    meaningful_keys: meaningfulKeys,
                    missing_keys   : missingKeys,
                    persisted_keys : persistedKeys,
                    missing_count  : missingKeys.length
                  };
                """
              timeout = 1
            } as $candidate_update_verification
          
            var.update $candidate_update_status {
              value = {}
                |set:"persisted_keys":$candidate_update_verification.persisted_keys
                |set:"missing_keys":$candidate_update_verification.missing_keys
                |set:"meaningful_keys":$candidate_update_verification.meaningful_keys
                |set:"attempts":1
            }
          
            conditional {
              if ($candidate_update_verification.missing_count != null && $candidate_update_verification.missing_count > 0) {
                db.patch parsed_candidate {
                  field_name = "id"
                  field_value = $candidate.id
                  data = $candidate_update_payload
                } as $candidate_update_retry
              
                var.update $candidate_update {
                  value = $candidate_update_retry
                }
              
                var.update $database_update_status {
                  value = $database_update_status
                    |set:"updated":($candidate_update_retry != null)
                }
              
                api.lambda {
                  code = """
                      const payload = $var.candidate_update_payload || {};
                      const updated = $var.candidate_update || {};
                    
                      const isMeaningful = (value) => {
                        if (value === null || value === undefined) {
                          return false;
                        }
                    
                        if (typeof value === "string") {
                          return value.trim().length > 0;
                        }
                    
                        if (Array.isArray(value)) {
                          return value.length > 0;
                        }
                    
                        if (typeof value === "number") {
                          return Number.isFinite(value);
                        }
                    
                        if (typeof value === "boolean") {
                          return true;
                        }
                    
                        if (typeof value === "object") {
                          return Object.keys(value).length > 0;
                        }
                    
                        return false;
                      };
                    
                      const meaningfulKeys = [];
                      const missingKeys = [];
                    
                      for (const [key, value] of Object.entries(payload)) {
                        if (!isMeaningful(value)) {
                          continue;
                        }
                    
                        meaningfulKeys.push(key);
                    
                        const updatedValue = updated ? updated[key] : undefined;
                    
                        if (!isMeaningful(updatedValue)) {
                          missingKeys.push(key);
                        }
                      }
                    
                      const persistedKeys = meaningfulKeys.filter((key) => !missingKeys.includes(key));
                    
                      return {
                        meaningful_keys: meaningfulKeys,
                        missing_keys   : missingKeys,
                        persisted_keys : persistedKeys,
                        missing_count  : missingKeys.length
                      };
                    """
                  timeout = 1
                } as $candidate_update_retry_verification
              
                var.update $candidate_update_status {
                  value = $candidate_update_status
                    |set:"persisted_keys":$candidate_update_retry_verification.persisted_keys
                    |set:"missing_keys":$candidate_update_retry_verification.missing_keys
                    |set:"meaningful_keys":$candidate_update_retry_verification.meaningful_keys
                    |set:"attempts":2
                }
              
                conditional {
                  if ($candidate_update_retry_verification.missing_count != 0) {
                    var.update $database_update_status {
                      value = $database_update_status
                        |set:"error":"persisted_fields_missing_after_retry"
                    }
                  }
                }
              
                precondition ($candidate_update_retry_verification.missing_count == 0) {
                  error_type = "servererror"
                  error = "Candidate update missing persisted fields after retry. Please try again later."
                  payload = {
                    missing_fields  : $candidate_update_retry_verification.missing_keys
                    attempted_fields: $candidate_update_retry_verification.meaningful_keys
                  }
                }
              }
            }
          
            conditional {
              if ($candidate_update != null && $candidate_update.elastic_search_document_id != null && $candidate_update.elastic_search_document_id != "" && $candidate_update_keys != null && $candidate_update_keys.count > 0) {
                var.update $elastic_update_status {
                  value = $elastic_update_status|set:"attempted":true
                }
              
                cloud.elasticsearch.document {
                  auth_type = "API Key"
                  key_id = $env.es_key_id
                  access_key = $env.es_access_key
                  region = ""
                  method = "GET"
                  index = "candidates"
                  doc_id = $candidate_update.elastic_search_document_id
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
                      const updates = $var.candidate_update_payload;
                    
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
                  doc_id = $candidate_update.elastic_search_document_id
                  doc = $es_updated_source
                } as $es_update
              
                var.update $elastic_update_status {
                  value = $elastic_update_status
                    |set:"updated":($es_update != null && $es_update.result != null)
                }
              }
            }
          }
        }
      }
    }
  
    // 6. TODO: integrate stage change logging once association context is defined
  
    api.lambda {
      code = """
          const fileStatus = $var.file_upload_status || {};
          const dbStatus = $var.database_update_status || {};
          const esStatus = $var.elastic_update_status || {};
        
          const toBoolean = (value) => Boolean(value === true);
        
          const fileOk = toBoolean(fileStatus.uploaded) || toBoolean(fileStatus.reused);
          const dbOk = toBoolean(dbStatus.updated);
          const esOk = esStatus.attempted ? toBoolean(esStatus.updated) : true;
        
          const overall = fileOk && dbOk && esOk;
        
          return {
            overall,
            file_success    : fileOk,
            database_success: dbOk,
            elastic_success : esOk,
            file: {
              attempted: toBoolean(fileStatus.attempted),
              uploaded : toBoolean(fileStatus.uploaded),
              reused   : toBoolean(fileStatus.reused),
              error    : fileStatus.error || null
            },
            database: {
              attempted: toBoolean(dbStatus.attempted),
              updated  : toBoolean(dbStatus.updated),
              error    : dbStatus.error || null
            },
            elasticsearch: {
              attempted: toBoolean(esStatus.attempted),
              updated  : toBoolean(esStatus.updated),
              error    : esStatus.error || null
            }
          };
        """
      timeout = 1
    } as $operation_status
  }

  response = {
    candidate_id           : $input.candidate_id
    resume_url             : $resume_url
    openai_file_id         : $openai_file_id
    candidate_update       : $candidate_update
    candidate_update_status: $candidate_update_status
    file_success           : $operation_status.file_success
    database_success       : $operation_status.database_success
    elastic_success        : $operation_status.elastic_success
    overall_success        : $operation_status.overall
    operation_status       : $operation_status
  }
}