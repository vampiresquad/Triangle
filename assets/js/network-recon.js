/*
 * Triangle - Network Reconnaissance Page Logic
 * Author: Muhammad Shourov
 * Version: 1.0.0
 * This script handles API calls for IP Lookup and DNS Lookup.
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Tool 1: IP Information (IP Lookup) ---
    const ipInput = document.getElementById('ip-input');
    const ipFetchBtn = document.getElementById('ip-fetch-btn');
    const ipOutput = document.getElementById('ip-output');
    const ipLoader = document.getElementById('ip-loader');

    if (ipFetchBtn) {
        ipFetchBtn.addEventListener('click', async () => {
            const ip = ipInput.value;
            if (!ip) {
                ipOutput.textContent = 'Error: Please enter an IP address.';
                return;
            }

            // Show loader and disable button
            ipLoader.style.display = 'block';
            ipFetchBtn.setAttribute('aria-busy', 'true');
            ipOutput.textContent = 'Fetching IP information...';
            
            // API Endpoint (ip-api.com is free, no key needed)
            const apiUrl = `http://ip-api.com/json/${ip}`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.status === 'fail') {
                    throw new Error(data.message || 'Invalid IP address');
                }
                
                // Format the JSON data for pretty printing in <pre>
                ipOutput.textContent = JSON.stringify(data, null, 2);

            } catch (e) {
                ipOutput.textContent = 'Error: ' + e.message;
            } finally {
                // Hide loader and re-enable button
                ipLoader.style.display = 'none';
                ipFetchBtn.setAttribute('aria-busy', 'false');
            }
        });
    }

    // --- Tool 2: DNS Lookup ---
    const dnsInput = document.getElementById('dns-input');
    const dnsFetchBtn = document.getElementById('dns-fetch-btn');
    const dnsOutput = document.getElementById('dns-output');
    const dnsLoader = document.getElementById('dns-loader');

    if (dnsFetchBtn) {
        dnsFetchBtn.addEventListener('click', async () => {
            const domain = dnsInput.value;
            if (!domain) {
                dnsOutput.textContent = 'Error: Please enter a domain name.';
                return;
            }
            
            // Show loader and disable button
            dnsLoader.style.display = 'block';
            dnsFetchBtn.setAttribute('aria-busy', 'true');
            dnsOutput.textContent = 'Fetching DNS records...';
            
            // API Endpoint (Google Public DNS over HTTPS - free, no key)
            const apiUrl = `https://dns.google.com/resolve?name=${domain}`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                // Format the JSON data for pretty printing
                dnsOutput.textContent = JSON.stringify(data, null, 2);

            } catch (e) {
                dnsOutput.textContent = 'Error: ' + e.message;
            } finally {
                // Hide loader and re-enable button
                dnsLoader.style.display = 'none';
                dnsFetchBtn.setAttribute('aria-busy', 'false');
            }
        });
    }

}); // DOMContentLoaded End
