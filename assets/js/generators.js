/*
 * Triangle - Generators & Misc Page Logic
 * Author: Muhammad Shourov
 * Version: 1.0.0
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Tool 1: Random String/Password Generator ---
    try {
        const passLength = document.getElementById('pass-length');
        const passUpper = document.getElementById('pass-uppercase');
        const passLower = document.getElementById('pass-lowercase');
        const passNumbers = document.getElementById('pass-numbers');
        const passSymbols = document.getElementById('pass-symbols');
        const passGenerateBtn = document.getElementById('pass-generate-btn');
        const passOutput = document.getElementById('pass-output');

        const charsets = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        passGenerateBtn.addEventListener('click', () => {
            let charset = '';
            if (passUpper.checked) charset += charsets.upper;
            if (passLower.checked) charset += charsets.lower;
            if (passNumbers.checked) charset += charsets.numbers;
            if (passSymbols.checked) charset += charsets.symbols;

            if (charset === '') {
                passOutput.value = 'Error: Please select at least one character set.';
                return;
            }

            let password = '';
            const length = parseInt(passLength.value);
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            passOutput.value = password;
        });
    } catch (e) { console.error('Password Generator tool error:', e); }

    // --- Tool 2: Wordlist Generator ---
    // Note: This is a simple permutation generator.
    // Be careful with high lengths, as it can crash the browser.
    try {
        const wordlistKeywords = document.getElementById('wordlist-keywords');
        const wordlistLength = document.getElementById('wordlist-length');
        const wordlistGenerateBtn = document.getElementById('wordlist-generate-btn');
        const wordlistOutput = document.getElementById('wordlist-output');

        wordlistGenerateBtn.addEventListener('click', () => {
            const keywords = wordlistKeywords.value.split(',').map(k => k.trim()).filter(k => k.length > 0);
            const maxLength = parseInt(wordlistLength.value);
            
            if (keywords.length === 0) {
                wordlistOutput.value = 'Error: Please enter at least one keyword.';
                return;
            }

            wordlistOutput.value = 'Generating...';
            let results = new Set(keywords); // Start with base keywords

            // Recursive function for permutations
            function getPermutations(currentList, currentLength) {
                if (currentLength > maxLength) return;

                for (let i = 0; i < keywords.length; i++) {
                    for (let item of currentList) {
                        if (currentLength + 1 <= maxLength) {
                            results.add(item + keywords[i]);
                        }
                    }
                }
                
                if (currentLength + 1 <= maxLength) {
                    getPermutations(Array.from(results), currentLength + 1);
                }
            }
            
            // Use setTimeout to prevent browser freeze
            setTimeout(() => {
                getPermutations(keywords, 1);
                wordlistOutput.value = Array.from(results).join('\n');
            }, 50);
        });
    } catch (e) { console.error('Wordlist Generator tool error:', e); }

    // --- Tool 3: cURL Command Generator ---
    try {
        const curlUrl = document.getElementById('curl-url');
        const curlMethod = document.getElementById('curl-method');
        const curlHeaders = document.getElementById('curl-headers');
        const curlData = document.getElementById('curl-data');
        const curlGenerateBtn = document.getElementById('curl-generate-btn');
        const curlOutput = document.getElementById('curl-output');

        curlGenerateBtn.addEventListener('click', () => {
            let command = 'curl';
            const url = curlUrl.value;
            if (!url) {
                curlOutput.value = 'Error: URL is required.';
                return;
            }

            command += ` -X ${curlMethod.value}`;
            command += ` "${url}"`;

            // Add headers
            curlHeaders.value.split('\n').forEach(header => {
                if (header.trim()) {
                    command += ` \\\n  -H "${header.trim()}"`;
                }
            });

            // Add data
            if (curlData.value.trim() && (curlMethod.value === 'POST' || curlMethod.value === 'PUT')) {
                command += ` \\\n  -d '${curlData.value.trim()}'`;
            }

            curlOutput.value = command;
        });
    } catch (e) { console.error('cURL Generator tool error:', e); }

    // --- Tool 4: Regex Tester ---
    try {
        const regexInput = document.getElementById('regex-input');
        const regexText = document.getElementById('regex-text');
        const regexTestBtn = document.getElementById('regex-test-btn');
        const regexOutput = document.getElementById('regex-output');

        regexTestBtn.addEventListener('click', () => {
            try {
                const regexPattern = regexInput.value;
                const text = regexText.value;
                
                // Get pattern and flags (e.g., /pattern/gi)
                const parts = regexPattern.match(/^\/(.*)\/([gimsuy]*)$/);
                if (!parts) {
                    throw new Error("Invalid Regex format. Use /pattern/flags (e.g., /hello/g).");
                }
                
                const regex = new RegExp(parts[1], parts[2]);
                const matches = text.match(regex);
                
                if (matches) {
                    regexOutput.textContent = `Found ${matches.length} match(es):\n\n${matches.join('\n')}`;
                } else {
                    regexOutput.textContent = '(No matches found)';
                }
            } catch (e) {
                regexOutput.textContent = 'Regex Error: ' + e.message;
            }
        });
    } catch (e) { console.error('Regex Tester tool error:', e); }

    // --- Tool 5: JSON Formatter ---
    try {
        const jsonInput = document.getElementById('json-input');
        const jsonFormatBtn = document.getElementById('json-format-btn');
        const jsonOutput = document.getElementById('json-output');

        jsonFormatBtn.addEventListener('click', () => {
            try {
                const parsed = JSON.parse(jsonInput.value);
                // Pretty-print with 2 spaces
                jsonOutput.textContent = JSON.stringify(parsed, null, 2);
                jsonOutput.style.color = 'var(--text-color)';
            } catch (e) {
                jsonOutput.textContent = 'Invalid JSON: ' + e.message;
                jsonOutput.style.color = '#ff6b6b'; // Red color for error
            }
        });
    } catch (e) { console.error('JSON Formatter tool error:', e); }
    
    // --- Tool 6: JWT Debugger ---
    try {
        const jwtInput = document.getElementById('jwt-input');
        const jwtDecodeBtn = document.getElementById('jwt-decode-btn');
        const jwtHeaderOutput = document.getElementById('jwt-header-output');
        const jwtPayloadOutput = document.getElementById('jwt-payload-output');

        jwtDecodeBtn.addEventListener('click', () => {
            try {
                const token = jwtInput.value.trim();
                const parts = token.split('.');
                
                if (parts.length !== 3) {
                    throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
                }
                
                // Decode Header (atob() is Base64 decode)
                const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
                jwtHeaderOutput.textContent = JSON.stringify(header, null, 2);
                jwtHeaderOutput.style.color = 'var(--text-color)';
                
                // Decode Payload
                const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                jwtPayloadOutput.textContent = JSON.stringify(payload, null, 2);
                jwtPayloadOutput.style.color = 'var(--text-color)';
                
            } catch (e) {
                jwtHeaderOutput.textContent = 'Decode Error: ' + e.message;
                jwtHeaderOutput.style.color = '#ff6b6b';
                jwtPayloadOutput.textContent = '(Decode failed)';
                jwtPayloadOutput.style.color = '#ff6b6b';
            }
        });
    } catch (e) { console.error('JWT Debugger tool error:', e); }

}); // DOMContentLoaded End
