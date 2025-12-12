query "widget/candidates" verb=GET {
  api_group = "candidates"

  input {
    text role? filters=trim
  }

  stack {
    api.lambda {
      code = """
        const puppeteer = await import("npm:puppeteer-core");
        
        // A 403 Forbidden error often indicates that the request is being blocked by a bot detection service.
        // This revised code adds features to help bypass these measures.
        
        // 1. Validate required input from the function stack.
        if (!($input.role && typeof $input.role === 'string')) {
            throw new Error("Input 'role' (string) is required.");
        }
        
        // 2. The API key is hardcoded as requested.
        // For better security in the future, consider moving this to an environment variable.
        const BROWSERLESS_API_KEY = "2SWyAHenvsyzpEofe7eba47a0701caa88e10810709fbff284";
        
        // 3. Add `&stealth=true` to the connection string.
        // This is a powerful Browserless.io feature that applies various techniques to make Puppeteer harder to detect.
        const BROWSERLESS_ENDPOINT = `wss://production-sfo.browserless.io/?token=${BROWSERLESS_API_KEY}&stealth=true`;
        
        let browser = null;
        try {
            const encodedRole = encodeURIComponent($input.role);
            const targetUrl = `https://candidates.betterway.dev/embed/widget?role=${encodedRole}`;
        
            // Connect to the remote browser with stealth options enabled.
            browser = await puppeteer.connect({ 
                browserWSEndpoint: BROWSERLESS_ENDPOINT,
                defaultViewport: null 
            });
            const page = await browser.newPage();
        
            // 4. Set a realistic User-Agent header.
            // This makes the request appear as if it's from a standard desktop browser, further reducing detection risk.
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
        
            // Navigate to the URL and wait until the page is fully loaded (including scripts).
            await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });
        
            // This line gets the raw, unencoded HTML content of the page as a plain string.
            const htmlContent = await page.content();
        
            // The function returns the raw HTML string. Any character escaping you see in the final 
            // Xano output is standard JSON formatting and does not alter the HTML itself.
            return htmlContent;
        
        } catch (error) {
            console.error('An error occurred during the headless browser operation:', error);
            throw error;
        } finally {
            // Ensure the browser connection is always closed to free up resources.
            if (browser) {
                await browser.close();
            }
        }
        """
      timeout = 10
    } as $x1
  
    util.set_header {
      value = "Content-type: text/html"
      duplicates = "replace"
    }
  }

  response = $x1
}