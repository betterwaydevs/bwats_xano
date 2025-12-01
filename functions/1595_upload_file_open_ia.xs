function upload_file_open_ia {
  input {
    text file_url filters=trim
  }

  stack {
    precondition ($input.file_url != null && $input.file_url != "") {
      error_type = "inputerror"
      error = "File URL is required"
    }
  
    var $file_url {
      value = $input.file_url
    }
  
    api.lambda {
      code = """
          const rawUrl = ($var.file_url || '').trim();
          if (!rawUrl) {
            return { error: { code: 'MISSING_URL' } };
          }
        
          const allowedExtensions = [
            'pdf', 'doc', 'docx', 'txt', 'rtf', 'md', 'markdown', 'csv',
            'json', 'html', 'htm', 'ppt', 'pptx', 'xls', 'xlsx',
            'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'
          ];
        
          let filenameCandidate = 'resume';
          let extension = '';
        
          try {
            const urlObj = new URL(rawUrl);
            const queryFilename = urlObj.searchParams.get('filename')
              || urlObj.searchParams.get('file')
              || urlObj.searchParams.get('name');
        
            if (queryFilename && queryFilename.trim().length > 0) {
              filenameCandidate = decodeURIComponent(queryFilename.trim());
            } else if (urlObj.pathname) {
              const segments = urlObj.pathname.split('/').filter(Boolean);
              if (segments.length > 0) {
                filenameCandidate = decodeURIComponent(segments[segments.length - 1]);
              }
            }
          } catch (err) {
            const parts = rawUrl.split('/').filter(Boolean);
            if (parts.length > 0) {
              filenameCandidate = decodeURIComponent(parts[parts.length - 1]);
            }
          }
        
          filenameCandidate = (filenameCandidate || 'resume').split('?')[0].split('#')[0];
          if (!filenameCandidate || filenameCandidate.trim().length === 0) {
            filenameCandidate = 'resume';
          }
        
          if (filenameCandidate.includes('.')) {
            extension = filenameCandidate.split('.').pop().toLowerCase();
          }
        
          let baseName = filenameCandidate;
          if (extension && filenameCandidate.includes('.')) {
            baseName = filenameCandidate.slice(0, filenameCandidate.length - extension.length - 1);
          }
        
          const normalizedFilename = extension ? `${baseName}.${extension}` : baseName;
          const isAllowedExtension = extension ? allowedExtensions.includes(extension) : null;
        
          return {
            error: null,
            filename: normalizedFilename || 'resume',
            extension,
            allowed_extensions: allowedExtensions,
            is_allowed_extension: isAllowedExtension,
            has_extension: Boolean(extension)
          };
        """
      timeout = 5
    } as $file_meta
  
    precondition ($file_meta.error == null) {
      error_type = "inputerror"
      error = "Invalid file URL"
      payload = $file_meta.error
    }
  
    precondition (($file_meta.has_extension == false) || ($file_meta.is_allowed_extension == true)) {
      error_type = "inputerror"
      error = "Unsupported file extension for OpenAI upload"
      payload = {
        extension: $file_meta.extension
        allowed  : $file_meta.allowed_extensions
        filename : $file_meta.filename
      }
    }
  
    var $download_context {
      value = {}
        |set:"file_url":$file_url
        |set:"filename":$file_meta.filename
        |set:"extension":$file_meta.extension
        |set:"allowed_extensions":$file_meta.allowed_extensions
        |set:"openai_api_key":$env.OPENAI_API_KEY
    }
  
    api.lambda {
      code = """
          const context = $var.download_context || {};
          const fileUrl = (context.file_url || '').trim();
        
          if (!fileUrl) {
            return { error: { code: 'MISSING_URL' } };
          }
        
          const allowedExtensions = Array.isArray(context.allowed_extensions)
            ? context.allowed_extensions
            : [];
        
          let filename = context.filename || 'resume';
          let extension = context.extension || '';
        
          const apiKey = (context.openai_api_key || '').trim();
          if (!apiKey) {
            return { error: { code: 'MISSING_OPENAI_API_KEY' } };
          }
        
          const mimeToExtension = {
            'application/pdf': 'pdf',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'text/plain': 'txt',
            'application/rtf': 'rtf',
            'text/rtf': 'rtf',
            'text/markdown': 'md',
            'text/x-markdown': 'markdown',
            'text/csv': 'csv',
            'application/json': 'json',
            'text/html': 'html',
            'application/vnd.ms-powerpoint': 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/pjpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/gif': 'gif',
            'image/bmp': 'bmp',
            'image/tiff': 'tiff',
            'image/webp': 'webp'
          };
        
          let downloadResponse;
          try {
            downloadResponse = await fetch(fileUrl);
          } catch (err) {
            return { error: { code: 'DOWNLOAD_FAILED', message: err?.message || 'Unable to fetch file' } };
          }
        
          if (!downloadResponse || !downloadResponse.ok) {
            let errorBody = null;
            try {
              errorBody = await downloadResponse.text();
            } catch (_) {
              errorBody = null;
            }
            return {
              error: {
                code  : 'DOWNLOAD_HTTP_ERROR',
                status: downloadResponse?.status || null,
                body  : errorBody
              }
            };
          }
        
          let contentType = downloadResponse.headers.get('content-type') || '';
          if (contentType.includes(';')) {
            contentType = contentType.split(';')[0].trim();
          }
        
          let buffer;
          try {
            const arrayBuffer = await downloadResponse.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
          } catch (err) {
            return { error: { code: 'DOWNLOAD_DECODE_FAILED', message: err?.message || 'Failed to read file buffer' } };
          }
        
          if (!buffer || buffer.length === 0) {
            return { error: { code: 'EMPTY_DOWNLOAD' } };
          }
        
          if (!extension && contentType) {
            const normalizedContentType = contentType.toLowerCase();
            if (mimeToExtension[normalizedContentType]) {
              extension = mimeToExtension[normalizedContentType];
            }
          }
        
          if (!extension) {
            return {
              error: {
                code         : 'UNKNOWN_EXTENSION',
                content_type : contentType || null
              }
            };
          }
        
          if (!allowedExtensions.includes(extension)) {
            return {
              error: {
                code        : 'UNSUPPORTED_EXTENSION',
                extension   : extension,
                content_type: contentType || null,
                allowed     : allowedExtensions
              }
            };
          }
        
          const lowerFilename = filename.toLowerCase();
          if (!lowerFilename.endsWith(`.${extension}`)) {
            const dotIndex = filename.lastIndexOf('.');
            const base = dotIndex > -1 ? filename.slice(0, dotIndex) : filename;
            filename = `${base}.${extension}`;
          }
        
          if (typeof FormData !== 'function' || typeof Blob !== 'function') {
            return { error: { code: 'FORMDATA_UNAVAILABLE' } };
          }
        
          const uploadContentType = contentType || `application/${extension}`;
        
          const form = new FormData();
          form.append('purpose', 'assistants');
          form.append('file', new Blob([buffer], { type: uploadContentType }), filename);
        
          let uploadResponse;
          try {
            uploadResponse = await fetch('https://api.openai.com/v1/files', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apiKey}`
              },
              body: form
            });
          } catch (err) {
            return { error: { code: 'UPLOAD_FAILED', message: err?.message || 'Unable to reach OpenAI' } };
          }
        
          const uploadResult = await uploadResponse.json().catch(() => ({}));
        
          if (!uploadResponse.ok) {
            return {
              error: uploadResult || { code: 'UPLOAD_HTTP_ERROR' },
              status: uploadResponse.status || null
            };
          }
        
          return {
            file_id     : uploadResult?.id || null,
            filename,
            extension,
            content_type: uploadContentType,
            status      : uploadResponse.status || 200
          };
        """
      timeout = 90
    } as $upload_result
  
    var $openai_file_id {
      value = $upload_result|get:"file_id"
    }
  
    var $openai_filename {
      value = $upload_result|get:"filename"
    }
  
    var $openai_extension {
      value = $upload_result|get:"extension"
    }
  
    var $openai_content_type {
      value = $upload_result|get:"content_type"
    }
  
    var $upload_status {
      value = $upload_result|get:"status"
    }
  
    var $upload_error_detail {
      value = $upload_result|get:"error"
    }
  
    var $upload_error_message {
      value = null
    }
  
    conditional {
      if ($upload_error_detail != null || $openai_file_id == null || $openai_file_id == "") {
        var.update $upload_error_message {
          value = "Failed to upload file to OpenAI"
        }
      }
    }
  }

  response = {
    file_id  : $openai_file_id
    filename : $openai_filename
    extension: $openai_extension
    mime_type: $openai_content_type
    status   : $upload_status
    error    : $upload_error_detail
    message  : $upload_error_message
  }
}