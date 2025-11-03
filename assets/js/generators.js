/*
 * Triangle - Generators & Misc Page Logic (Upgraded)
 * Author: Muhammad Shourov
 * Version: 1.1.0
 * Added: Copy to Clipboard & .txt Download
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- *** নতুন হেলপার ফাংশন: কপি টু ক্লিপবোর্ড *** ---
    // এই ফাংশনটি আমরা সব কপি বাটনের জন্য ব্যবহার করব
    function setupCopyButton(buttonId, outputId) {
        const copyBtn = document.getElementById(buttonId);
        const outputEl = document.getElementById(outputId);
        
        if (copyBtn && outputEl) {
            copyBtn.addEventListener('click', () => {
                const textToCopy = outputEl.value || outputEl.textContent;
                
                if (!textToCopy || textToCopy.startsWith('(') || textToCopy.startsWith('Error:')) {
                    copyBtn.textContent = 'Empty!';
                    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
                    return;
                }
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
        }
    }
    // --- *** নতুন ফাংশন শেষ *** ---


    // --- Tool 1: Random String/Password Generator (আগের কোড) ---
    try {
        const passGenerateBtn = document.getElementById('pass-generate-btn');
        passGenerateBtn.addEventListener('click', () => {
            const passLength = document.getElementById('pass-length');
            const passUpper = document.getElementById('pass-uppercase');
            const passLower = document.getElementById('pass-lowercase');
            const passNumbers = document.getElementById('pass-numbers');
            const passSymbols = document.getElementById('pass-symbols');
            const passOutput = document.getElementById('pass-output');
            
            const charsets = { /* ... (charset ডেটা অপরিবর্তিত) ... */
                upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                lower: 'abcdefghijklmnopqrstuvwxyz',
                numbers: '0123456789',
                symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
            };

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
                password += charset[Math.floor(Math.random() * charset.length)];
            }
            passOutput.value = password;
        });
        
        // --- *** নতুন সংযোজন: কপি বাটনকে চালু করা *** ---
        setupCopyButton('pass-copy-btn', 'pass-output');

    } catch (e) { console.error('Password Generator tool error:', e); }

    // --- Tool 2: Wordlist Generator (আগের কোড + নতুন ডাউনলোড লজিক) ---
    try {
        const wordlistGenerateBtn = document.getElementById('wordlist-generate-btn');
        const wordlistDownloadBtn = document.getElementById('wordlist-download-btn'); // নতুন বাটন
        const wordlistOutput = document.getElementById('wordlist-output');

        wordlistGenerateBtn.addEventListener('click', () => {
            // ... (জেনারেটরের মূল লজিক অপরিবর্তিত আছে) ...
            const keywords = document.getElementById('wordlist-keywords').value.split(',').map(k => k.trim()).filter(k => k.length > 0);
            const maxLength = parseInt(document.getElementById('wordlist-length').value);
            
            if (keywords.length === 0) {
                wordlistOutput.value = 'Error: Please enter at least one keyword.';
                return;
            }

            wordlistGenerateBtn.setAttribute('aria-busy', 'true');
            wordlistDownloadBtn.disabled = true; // --- নতুন সংযোজন ---
            wordlistOutput.value = 'Generating... (This may take a moment)';
            
            let results = new Set(keywords);
            function getPermutations(currentList, currentLength) {
                if (currentLength > maxLength) return;
                let newList = new Set();
                for (let i = 0; i < keywords.length; i++) {
                    for (let item of currentList) {
                        if (currentLength + 1 <= maxLength) {
                            const newItem = item + keywords[i];
                            if (!results.has(newItem)) {
                                results.add(newItem);
                                newList.add(newItem);
                            }
                        }
                    }
                }
                if (newList.size > 0 && currentLength + 1 < maxLength) {
                    getPermutations(newList, currentLength + 1);
                }
            }
            
            setTimeout(() => {
                getPermutations(new Set(keywords), 1);
                wordlistOutput.value = Array.from(results).join('\n');
                wordlistGenerateBtn.setAttribute('aria-busy', 'false');
                wordlistDownloadBtn.disabled = false; // --- নতুন সংযোজন: ডাউনলোড বাটন সচল করা ---
            }, 50);
        });

        // --- *** নতুন সংযোজন: ডাউনলোড বাটনের লজিক *** ---
        wordlistDownloadBtn.addEventListener('click', () => {
            const text = wordlistOutput.value;
            if (!text || text.startsWith('Generating...')) {
                alert('Please generate a wordlist first.');
                return;
            }
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'triangle_wordlist.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

    } catch (e) { console.error('Wordlist Generator tool error:', e); }

    // --- Tool 3: cURL Command Generator (আগের কোড) ---
    try {
        const curlGenerateBtn = document.getElementById('curl-generate-btn');
        curlGenerateBtn.addEventListener('click', () => {
            // ... (cURL জেনারেটরের মূল লজিক অপরিবর্তিত আছে) ...
            const curlUrl = document.getElementById('curl-url');
            const curlMethod = document.getElementById('curl-method');
            const curlHeaders = document.getElementById('curl-headers');
            const curlData = document.getElementById('curl-data');
            const curlOutput = document.getElementById('curl-output');
            let command = 'curl';
            const url = curlUrl.value;
            if (!url) { curlOutput.value = 'Error: URL is required.'; return; }
            command += ` -X ${curlMethod.value}`;
            command += ` "${url}"`;
            curlHeaders.value.split('\n').forEach(header => {
                if (header.trim()) { command += ` \\\n  -H "${header.trim()}"`; }
            });
            if (curlData.value.trim() && (curlMethod.value === 'POST' || curlMethod.value === 'PUT')) {
                command += ` \\\n  -d '${curlData.value.trim()}'`;
            }
            curlOutput.value = command;
        });
        
        // --- *** নতুন সংযোজন: কপি বাটনকে চালু করা *** ---
        setupCopyButton('curl-copy-btn', 'curl-output');

    } catch (e) { console.error('cURL Generator tool error:', e); }

    // --- Tool 4: Regex Tester (আগের কোড) ---
    try {
        const regexTestBtn = document.getElementById('regex-test-btn');
        regexTestBtn.addEventListener('click', () => {
            // ... (Regex টেস্টারের মূল লজিক অপরিবর্তিত আছে) ...
            const regexInput = document.getElementById('regex-input');
            const regexText = document.getElementById('regex-text');
            const regexOutput = document.getElementById('regex-output');
            try {
                const regexPattern = regexInput.value;
                const text = regexText.value;
                const parts = regexPattern.match(/^\/(.*)\/([gimsuy]*)$/);
                if (!parts) { throw new Error("Invalid Regex format. Use /pattern/flags."); }
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
        
        // --- *** নতুন সংযোজন: কপি বাটনকে চালু করা *** ---
        setupCopyButton('regex-copy-btn', 'regex-output');

    } catch (e) { console.error('Regex Tester tool error:', e); }

    // --- Tool 5: JSON Formatter (আগের কোড) ---
    try {
        const jsonFormatBtn = document.getElementById('json-format-btn');
        jsonFormatBtn.addEventListener('click', () => {
            // ... (JSON ফরম্যাটারের মূল লজিক অপরিবর্তিত আছে) ...
            const jsonInput = document.getElementById('json-input');
            const jsonOutput = document.getElementById('json-output');
            try {
                const parsed = JSON.parse(jsonInput.value);
                jsonOutput.textContent = JSON.stringify(parsed, null, 2);
                jsonOutput.style.color = 'var(--text-color)';
            } catch (e) {
                jsonOutput.textContent = 'Invalid JSON: ' + e.message;
                jsonOutput.style.color = '#ff6b6b';
            }
        });
        
        // --- *** নতুন সংযোজন: কপি বাটনকে চালু করা *** ---
        setupCopyButton('json-copy-btn', 'json-output');

    } catch (e) { console.error('JSON Formatter tool error:', e); }
    
    // --- Tool 6: JWT Debugger (আগের কোড) ---
    try {
        const jwtDecodeBtn = document.getElementById('jwt-decode-btn');
        jwtDecodeBtn.addEventListener('click', () => {
            // ... (JWT ডিকোডারের মূল লজিক অপরিবর্তিত আছে) ...
            const jwtInput = document.getElementById('jwt-input');
            const jwtHeaderOutput = document.getElementById('jwt-header-output');
            const jwtPayloadOutput = document.getElementById('jwt-payload-output');
            try {
                const token = jwtInput.value.trim();
                const parts = token.split('.');
                if (parts.length !== 3) { throw new Error('Invalid JWT format.'); }
                const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
                jwtHeaderOutput.textContent = JSON.stringify(header, null, 2);
                jwtHeaderOutput.style.color = 'var(--text-color)';
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
        
        // --- *** নতুন সংযোজন: কপি বাটনগুলোকে চালু করা *** ---
        setupCopyButton('jwt-header-copy-btn', 'jwt-header-output');
        setupCopyButton('jwt-payload-copy-btn', 'jwt-payload-output');

    } catch (e) { console.error('JWT Debugger tool error:', e); }

}); // DOMContentLoaded End
