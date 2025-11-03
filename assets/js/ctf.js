/*
 * Triangle - CTF & Forensics Page Logic
 * Author: Muhammad Shourov
 * Version: 1.0.0
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Tool 1: Classic Ciphers ---
    try {
        const cipherInput = document.getElementById('cipher-input');
        const cipherType = document.getElementById('cipher-type');
        const caesarShift = document.getElementById('caesar-shift');
        const caesarShiftLabel = document.getElementById('caesar-shift-label');
        const encodeBtn = document.getElementById('cipher-encode-btn');
        const decodeBtn = document.getElementById('cipher-decode-btn');
        const cipherOutput = document.getElementById('cipher-output');

        // Helper function for Caesar/ROT13
        function shiftCipher(text, shift) {
            return text.replace(/[a-zA-Z]/g, (char) => {
                const base = char.charCodeAt(0) < 97 ? 65 : 97; // 65 for 'A', 97 for 'a'
                let code = char.charCodeAt(0);
                
                // (code - base + shift) % 26 + base
                code = (code - base + shift) % 26;
                if (code < 0) { // Handle negative shifts correctly
                    code += 26;
                }
                return String.fromCharCode(code + base);
            });
        }

        // Show/hide Caesar shift input
        cipherType.addEventListener('change', () => {
            if (cipherType.value === 'caesar') {
                caesarShift.style.display = 'block';
                caesarShiftLabel.style.display = 'block';
            } else {
                caesarShift.style.display = 'none';
                caesarShiftLabel.style.display = 'none';
            }
        });

        encodeBtn.addEventListener('click', () => {
            const text = cipherInput.value;
            let shift = 13;
            if (cipherType.value === 'caesar') {
                shift = parseInt(caesarShift.value) || 13;
            }
            cipherOutput.textContent = shiftCipher(text, shift);
        });

        decodeBtn.addEventListener('click', () => {
            const text = cipherInput.value;
            let shift = -13; // Decode is just a negative shift
            if (cipherType.value === 'caesar') {
                shift = -(parseInt(caesarShift.value) || 13);
            }
            cipherOutput.textContent = shiftCipher(text, shift);
        });
    } catch (e) { console.error('Cipher tool error:', e); }

    // --- Tool 2: EXIF Data Viewer ---
    try {
        const fileInput = document.getElementById('exif-file-input');
        const output = document.getElementById('exif-output');

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) {
                output.textContent = '(No file selected)';
                return;
            }
            if (file.type !== 'image/jpeg') {
                output.textContent = 'Error: Please upload a JPEG file.';
                return;
            }

            output.textContent = 'Reading EXIF data...';

            // EXIF.js library (loaded in HTML)
            EXIF.getData(file, function() {
                const allTags = EXIF.getAllTags(this);
                if (Object.keys(allTags).length === 0) {
                    output.textContent = 'No EXIF data found in this image.';
                    return;
                }
                
                // Format for pretty output
                let result = '';
                for (let tag in allTags) {
                    if (allTags.hasOwnProperty(tag)) {
                        result += `${tag}: ${allTags[tag]}\n`;
                    }
                }
                output.textContent = result;
            });
        });
    } catch (e) { console.error('EXIF tool error:', e); }

    // --- Tool 3: 'strings' Extractor ---
    try {
        const stringsFileInput = document.getElementById('strings-file-input');
        const stringsExtractBtn = document.getElementById('strings-extract-btn');
        const stringsOutput = document.getElementById('strings-output');

        stringsExtractBtn.addEventListener('click', () => {
            const file = stringsFileInput.files[0];
            if (!file) {
                stringsOutput.value = 'Error: Please select a file first.';
                return;
            }

            stringsExtractBtn.setAttribute('aria-busy', 'true');
            stringsOutput.value = 'Processing file...';

            const reader = new FileReader();

            reader.onload = (e) => {
                const buffer = e.target.result;
                const uint8 = new Uint8Array(buffer); // Read file as bytes
                
                let result = '';
                let currentString = '';
                const minLength = 4; // Minimum string length

                for (let i = 0; i < uint8.length; i++) {
                    const charCode = uint8[i];
                    
                    // Check for printable ASCII characters (32 to 126)
                    // 32=space, 9=tab, 10=newline, 13=carriage return
                    if (charCode >= 32 && charCode <= 126) {
                        currentString += String.fromCharCode(charCode);
                    } else {
                        // End of a potential string
                        if (currentString.length >= minLength) {
                            result += currentString + '\n';
                        }
                        currentString = '';
                    }
                }
                
                // Check for the last string
                if (currentString.length >= minLength) {
                    result += currentString;
                }
                
                stringsOutput.value = result || '(No readable strings found)';
                stringsExtractBtn.setAttribute('aria-busy', 'false');
            };

            reader.onerror = (e) => {
                stringsOutput.value = 'Error: Could not read the file. ' + e.message;
                stringsExtractBtn.setAttribute('aria-busy', 'false');
            };

            // Read the file as raw bytes
            reader.readAsArrayBuffer(file);
        });
    } catch (e) { console.error('Strings tool error:', e); }

}); // DOMContentLoaded End
