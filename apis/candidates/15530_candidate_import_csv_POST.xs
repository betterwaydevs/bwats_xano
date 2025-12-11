query "candidate/import_csv" verb=POST {
  auth = "user"

  input {
    file csv_content
    int project_id filters=min:1
    int stage_id filters=min:1
  }

  stack {
    // Validaciones previas de proyecto y etapa
    db.get project {
      field_name = "id"
      field_value = $input.project_id
    } as $project
  
    precondition ($project != null) {
      error_type = "notfound"
      error = "Proyecto no encontrado"
    }
  
    db.get stage {
      field_name = "id"
      field_value = $input.stage_id
    } as $stage
  
    precondition ($stage != null) {
      error_type = "notfound"
      error = "Etapa no encontrada"
    }
  
    precondition ($stage.project_id == $input.project_id) {
      error_type = "badrequest"
      error = "La etapa no pertenece al proyecto indicado"
    }
  
    precondition ($stage.stage_type == "candidates") {
      error_type = "badrequest"
      error = "La etapa indicada no es v\303\241lida para candidatos"
    }
  
    storage.read_file_resource {
      value = $input.csv_content
    } as $csv_raw_content
  
    // Extraer el contenido de texto del File Resource (propiedad 'data')
    var $csv_text_content {
      value = $csv_raw_content.data
    }
  
    // Section A - Parse CSV using JavaScript Lambda
    api.lambda {
      code = """
        const csvContent = $var.csv_text_content || '';
        
        // Debug information
        const debugInfo = {
          contentReceived: csvContent ? true : false,
          contentLength: csvContent.length,
          contentType: typeof csvContent,
          firstChars: csvContent.substring(0, 150)
        };
        
        if (!csvContent || csvContent.trim() === '') {
          return {
            valid_candidates: [],
            validation_errors: [],
            debug_error: 'No CSV content provided',
            debug_info: debugInfo
          };
        }
        
        const normalizedCsv = csvContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Split lines respecting quoted fields (handles multi-line fields within quotes)
        const lines = [];
        let currentLine = '';
        let inQuotes = false;
        
        for (let i = 0; i < normalizedCsv.length; i++) {
          const char = normalizedCsv[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
            currentLine += char;
          } else if (char === '\n' && !inQuotes) {
            if (currentLine.trim()) {
              lines.push(currentLine);
            }
            currentLine = '';
          } else {
            currentLine += char;
          }
        }
        if (currentLine.trim()) {
          lines.push(currentLine);
        }
        
        const candidates = [];
        const errors = [];
        const seenLinkedin = new Set();
        
        let currentHeaders = null;
        let currentCandidate = null;
        let lineIndex = 0;
        let headersFound = false;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          lineIndex++;
          
          const lowerLine = line.toLowerCase();
          if (lowerLine.includes('application_id') && lowerLine.includes('name') && lowerLine.includes('linkedin_profile')) {
            if (currentCandidate && currentCandidate.name && currentCandidate.linkedin_profile) {
              candidates.push(currentCandidate);
            }
            currentHeaders = line.split(',').map(h => h.trim().toLowerCase());
            currentCandidate = null;
            headersFound = true;
            continue;
          }
          
          if (!currentHeaders) {
            // Línea antes de encontrar cabeceras - agregar a errores de validación
            errors.push({ 
              line: lineIndex, 
              content: line.substring(0, 50) + (line.length > 50 ? '...' : ''), 
              error: 'Línea antes de cabeceras válidas (application_id, name, linkedin_profile)' 
            });
            continue;
          }
          
          const firstComma = line.indexOf(',');
          const firstPart = firstComma > 0 ? line.substring(0, firstComma).trim() : '';
          const isNumeric = firstPart.length > 0 && !isNaN(Number(firstPart));
          
          if (isNumeric) {
            if (currentCandidate && currentCandidate.name && currentCandidate.linkedin_profile) {
              candidates.push(currentCandidate);
            }
            
            const values = [];
            let current = '';
            let inQuotes = false;
            for (let j = 0; j < line.length; j++) {
              const char = line[j];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            values.push(current.trim());
            
            currentCandidate = { _line: lineIndex };
            for (let k = 0; k < currentHeaders.length && k < values.length; k++) {
              // Remove surrounding quotes if present
              let value = values[k];
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
              }
              currentCandidate[currentHeaders[k]] = value;
            }
          } else if (currentCandidate) {
            currentCandidate.description = (currentCandidate.description || '') + ' ' + line;
          }
        }
        
        if (currentCandidate && currentCandidate.name && currentCandidate.linkedin_profile) {
          candidates.push(currentCandidate);
        }
        
        const validCandidates = [];
        
        for (const c of candidates) {
          if (!c.name || c.name.trim() === '') {
            errors.push({ line: c._line, name: c.name || '', error: 'Nombre faltante' });
            continue;
          }
          if (!c.linkedin_profile || c.linkedin_profile.trim() === '') {
            errors.push({ line: c._line, name: c.name, error: 'LinkedIn faltante' });
            continue;
          }
          
          const li = c.linkedin_profile.toLowerCase();
          if (!li.includes('linkedin.com/in/')) {
            errors.push({ line: c._line, name: c.name, linkedin: c.linkedin_profile, error: 'Formato de LinkedIn invalido' });
            continue;
          }
          
          const nameParts = c.name.trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          if (!firstName) {
            errors.push({ line: c._line, name: c.name, error: 'No se pudo extraer el nombre' });
            continue;
          }
          
          const normalizedLinkedin = c.linkedin_profile.trim();
          const linkedinKey = normalizedLinkedin.toLowerCase();
          if (seenLinkedin.has(linkedinKey)) {
            errors.push({ line: c._line, name: c.name, linkedin: c.linkedin_profile, error: 'LinkedIn duplicado en CSV' });
            continue;
          }
          seenLinkedin.add(linkedinKey);
          
          validCandidates.push({
            first_name: firstName,
            last_name: lastName,
            linkedin_profile: normalizedLinkedin,
            location: c.location || '',
            application_id: c.application_id || ''
          });
        }
        
        return {
          valid_candidates: validCandidates,
          validation_errors: errors,
          debug_error: headersFound ? null : 'No se encontraron cabeceras válidas en el CSV',
          debug_info: debugInfo
        };
        """
      timeout = 30
    } as $parsed_data
  
    // Extract results from Lambda with safe defaults
    var $valid_candidates {
      value = ($parsed_data.valid_candidates != null ? $parsed_data.valid_candidates : [])
    }
  
    var $validation_errors {
      value = ($parsed_data.validation_errors != null ? $parsed_data.validation_errors : [])
    }
  
    // Section B - Process valid candidates
    var $success_count {
      value = 0
    }
  
    var $creation_errors {
      value = []
    }
  
    foreach ($valid_candidates) {
      each as $candidate {
        try_catch {
          try {
            function.run "candidates/candidate_quick_create" {
              input = {
                linkedin_profile: $candidate.linkedin_profile
                project_id      : $input.project_id
                stage_id        : $input.stage_id
                first_name      : $candidate.first_name
                last_name       : $candidate.last_name
                email           : ""
              }
            } as $created
          
            var.update $success_count {
              value = $success_count + 1
            }
          }
        
          catch {
            array.push $creation_errors {
              value = {
                name    : $candidate.first_name|concat:" "|concat:$candidate.last_name
                linkedin: $candidate.linkedin_profile
                error   : ($error.message != null ? $error.message : "Error al crear candidato")
              }
            }
          }
        }
      }
    }
  }

  response = {
    total_parsed     : $valid_candidates|count
    success_count    : $success_count
    fail_count       : $creation_errors|count
    validation_errors: $validation_errors
    creation_errors  : $creation_errors
    debug_error      : $parsed_data.debug_error
    debug_info       : $parsed_data.debug_info
  }
}