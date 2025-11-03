/*
 * Triangle - Web Reconnaissance Page Logic
 * Author: Muhammad Shourov
 * Version: 1.0.0
 * This script handles API calls for Headers, Subdomains, and the URL Parser.
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Tool 1: HTTP Header Viewer ---
    const headerInput = document.getElementById('header-input');
    const headerFetchBtn = document.getElementById('header-fetch-btn');
    const headerOutput = document.getElementById('header-output');
    const headerLoader = document.getElementById('header-loader');
    
    // API Endpoints
    const CORS_PROXY = 'https://api.allorigins.win/raw?url='; // Our safe proxy

    if (headerFetchBtn) {
        headerFetchBtn.addEventListener('click', async () => {
            const targetUrl = headerInput.value;
            if (!targetUrl) {
                headerOutput.textContent = 'Error: Please enter a URL.';
                return;
            }
            
            // Show loader and disable button
            headerLoader.style.display = 'block';
            headerFetchBtn.setAttribute('aria-busy', 'true');
            headerOutput.textContent = 'Fetching headers...';

            try {
                // We use the proxy to avoid CORS errors
                const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
                const response = await fetch(proxyUrl);
                
                let headersText = '';
                // The 'Headers' object is iterable
                for (const [key, value] of response.headers.entries()) {
                    headersText += `${key}: ${value}\n`;
                }
                
                headerOutput.textContent = headersText || 'No headers found.';

            } catch (e) {
                headerOutput.textContent = 'Error: Could not fetch headers. Check the URL or console.\n' + e.message;
            } finally {
                // Hide loader and re-enable button
                headerLoader.style.display = 'none';
                headerFetchBtn.setAttribute('aria-busy', 'false');
            }
        });
    }

    // --- Tool 2: Subdomain Finder ---
    const subdomainInput = document.getElementById('subdomain-input');
    const subdomainFetchBtn = document.getElementById('subdomain-fetch-btn');
    const subdomainOutput = document.getElementById('subdomain-output');
    const subdomainLoader = document.getElementById('subdomain-loader');

    if (subdomainFetchBtn) {
        subdomainFetchBtn.addEventListener('click', async () => {
            const domain = subdomainInput.value;
            if (!domain) {
                subdomainOutput.value = 'Error: Please enter a domain.';
                return;
            }
            
            // Show loader and disable button
            subdomainLoader.style.display = 'block';
            subdomainFetchBtn.setAttribute('aria-busy', 'true');
            subdomainOutput.value = 'Searching for subdomains...';
            
            // crt.sh API endpoint
            const apiUrl = `https://crt.sh/?q=%.${domain}&output=json`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('crt.sh API response was not OK.');
                }
                
                const data = await response.json();
                
                if (data.length === 0) {
                    subdomainOutput.value = 'No subdomains found for ' + domain;
                    return;
                }
                
                // Use a Set to store only unique domain names
                const domains = new Set();
                data.forEach(item => {
                    // crt.sh returns 'name_value' which can have multiple lines
                    const names = item.name_value.split('\n');
                    names.forEach(name => {
                        if (name.includes(domain)) { // Ensure it's the correct domain
                            domains.add(name);
                        }
                    });
                });
                
                // Join the unique names with a newline
                subdomainOutput.value = Array.from(domains).join('\n');
                
            } catch (e) {
                subdomainOutput.value = 'Error: Failed to fetch subdomains.\n' + e.message;
            } finally {
                // Hide loader and re-enable button
                subdomainLoader.style.display = 'none';
                subdomainFetchBtn.setAttribute('aria-busy', 'false');
            }
        });
    }

    // --- Tool 3: URL Parser ---
    const urlParserInput = document.getElementById('url-parser-input');
    const urlParseBtn = document.getElementById('url-parse-btn');
    
    // Output fields
    const urlProtocol = document.getElementById('url-protocol');
    const urlHost = document.getElementById('url-host');
    const urlPort = document.getElementById('url-port');
    const urlPath = document.getElementById('url-path');
    const urlQuery = document.getElementById('url-query');
    const urlFragment = document.getElementById('url-fragment');

    if (urlParseBtn) {
        urlParseBtn.addEventListener('click', () => {
            const fullUrl = urlParserInput.value;
            if (!fullUrl) {
                alert('Please enter a URL to parse.');
                return;
            }

            try {
                // The built-in URL constructor does all the work!
                const url = new URL(fullUrl);
                
                urlProtocol.value = url.protocol;
                urlHost.value = url.hostname;
                urlPort.value = url.port || '(default)';
                urlPath.value = url.pathname;
                urlQuery.value = url.search || '(none)';
                urlFragment.value = url.hash || '(none)';
                
            } catch (e) {
                alert('Error: Invalid URL format.\n' + e.message);
                // Clear fields
                urlProtocol.value = '';
                urlHost.value = '';
                urlPort.value = '';
                urlPath.value = '';
                urlQuery.value = '';
                urlFragment.value = '';
            }
        });
    }

}); // DOMContentLoaded End
