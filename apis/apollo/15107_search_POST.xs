query search verb=POST {
  api_group = "apollo"

  input {
    object prospects? {
      schema {
        text apollo_id? filters=trim
        text apollo_first_name? filters=trim
        text apollo_last_name? filters=trim
        text apollo_organization_name? filters=trim
        text apollo_email? filters=trim
        text apollo_contact_created_at? filters=trim
      }
    }
  }

  stack {
    api.lambda {
      code = """
        const url = 'https://api.apollo.io/v1/contacts/search';
        
        // Securely retrieve the API key from environment variables
        const apiKey = $env.apollo_key;
        
        if (!apiKey) {
            throw new Error('Apollo API key is not configured. Please set it in your environment variables as "apollo_key".');
        }
        
        // Ensure the required input prospect is provided
        if (!$input.prospects || typeof $input.prospects !== 'object') {
            throw new Error('Input "prospects" is required and must be a prospect object.');
        }
        
        // Hardcoded contact stages mapping (current/correct stages)
        const CONTACT_STAGES = {
            "65afecb40ed9b7042122b782": { display_name: "Cold", category: "in_progress" },
            "65afecb40ed9b7042122b783": { display_name: "Approaching", category: "in_progress" },
            "65afecb40ed9b7042122b784": { display_name: "Replied", category: "in_progress" },
            "65afecb40ed9b7042122b785": { display_name: "Interested", category: "succeeded" },
            "65afecb40ed9b7042122b786": { display_name: "Not Interested", category: "failed" },
            "65afecb40ed9b7042122b787": { display_name: "Unresponsive", category: "failed" },
            "65afecb40ed9b7042122b788": { display_name: "Do Not Contact", category: "failed" },
            "65afecb40ed9b7042122b789": { display_name: "Bad Data", category: null },
            "65afecb40ed9b7042122b78a": { display_name: "Changed Job", category: null },
            "66be8b6494474c01b30549ac": { display_name: "Open", category: "in_progress" },
            "66be8b6494474c01b30549ad": { display_name: "Open Deal", category: "succeeded" },
            "66be8b6494474c01b30549ae": { display_name: "Unqualified", category: "failed" }
        };
        
        // Helper function to build keywords for the prospect
        function buildProspectKeywords(prospectData) {
            if (!prospectData || !prospectData.apollo_id) {
                return null;
            }
            
            const keywords = [];
            if (prospectData.apollo_first_name) keywords.push(prospectData.apollo_first_name);
            if (prospectData.apollo_last_name) keywords.push(prospectData.apollo_last_name);
            if (prospectData.apollo_organization_name) keywords.push(prospectData.apollo_organization_name);
            if (prospectData.apollo_email) keywords.push(prospectData.apollo_email);
            
            return keywords.length > 0 ? keywords.join(' ') : null;
        }
        
        // No rate limiting needed for small batches
        
        // Main execution
        try {
            const prospectData = $input.prospects;
            
            console.log(`Processing single prospect for Apollo stage lookup`);
            
            // Build keywords for the prospect
            const keywords = buildProspectKeywords(prospectData);
            
            if (!keywords) {
                console.log("No valid prospect data with Apollo ID found");
                return {
                    found: false,
                    error: "No valid Apollo data provided"
                };
            }
            
            console.log(`Searching Apollo with keywords: ${keywords}`);
            
            // Make API call to search for the prospect
            const payload = {
                q_keywords: keywords,
                page: 1,
                per_page: 25, // Get multiple results to find the right one
                sort_by_field: "contact_last_activity_date",
                sort_ascending: false
            };
            
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'X-Api-Key': apiKey
                },
                body: JSON.stringify(payload)
            };
            
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`Apollo API request failed with status ${response.status}: ${await response.text()}`);
            }
            
            const data = await response.json();
            const contacts = data.contacts || [];
            
            console.log(`Apollo returned ${contacts.length} contacts`);
            
            // Find the contact with matching Apollo ID
            const matchedContact = contacts.find(contact => contact.id === prospectData.apollo_id);
            
            if (matchedContact) {
                // Get stage information
                const stageId = matchedContact.contact_stage_id;
                const stageInfo = CONTACT_STAGES[stageId] || { display_name: "Unknown", category: null };
                
                console.log(`Found Apollo match: Stage ${stageInfo.display_name}`);
                
                // Get campaign status information (last action)
                const campaignStatuses = matchedContact.contact_campaign_statuses || [];
                const lastCampaignStatus = campaignStatuses.length > 0 ? campaignStatuses[0] : null;
                
                return {
                    found: true,
                    apollo_data: {
                        apollo_id: matchedContact.id,
                        apollo_first_name: prospectData.apollo_first_name,
                        apollo_last_name: prospectData.apollo_last_name,
                        apollo_organization_name: prospectData.apollo_organization_name,
                        apollo_email: prospectData.apollo_email,
                        apollo_contact_created_at: prospectData.apollo_contact_created_at
                    },
                    apollo_stage: {
                        stage_id: stageId,
                        stage_name: stageInfo.display_name,
                        stage_category: stageInfo.category
                    },
                    apollo_activity: {
                        last_activity_date: matchedContact.last_activity_date,
                        updated_at: matchedContact.updated_at
                    },
                    apollo_campaign: lastCampaignStatus ? {
                        campaign_id: lastCampaignStatus.emailer_campaign_id,
                        status: lastCampaignStatus.status,
                        inactive_reason: lastCampaignStatus.inactive_reason,
                        added_at: lastCampaignStatus.added_at,
                        finished_at: lastCampaignStatus.finished_at,
                        current_step_position: lastCampaignStatus.current_step_position,
                        send_email_from: lastCampaignStatus.send_email_from_email_address
                    } : null
                };
            } else {
                console.log(`No Apollo match found with ID ${prospectData.apollo_id}`);
                
                return {
                    found: false,
                    searched_contacts: contacts.length,
                    apollo_id_searched: prospectData.apollo_id,
                    error: "No contact found with matching Apollo ID"
                };
            }
            
        } catch (error) {
            console.error("An error occurred during the Apollo stage lookup:", error.message);
            throw error;
        }
        """
      timeout = 10
    } as $x1
  }

  response = $x1
}