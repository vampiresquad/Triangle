/*
 * Triangle - Encoding & Hashing Page Logic
 * Author: Muhammad Shourov
 * Version: 1.0.0
*/

// সব টুলসকে আলাদা এবং পরিষ্কার রাখার জন্য DOMContentLoaded ইভেন্ট ব্যবহার করা
document.addEventListener('DOMContentLoaded', () => {

    // --- Tool 1: Base64 Encoder/Decoder ---
    const base64Input = document.getElementById('base64-input');
    const base64Output = document.getElementById('base64-output');
    const base64EncodeBtn = document.getElementById('base64-encode-btn');
    const base64DecodeBtn = document.getElementById('base64-decode-btn');

    if (base64EncodeBtn) {
        base64EncodeBtn.addEventListener('click', () => {
            try {
                // btoa() হলো জাভাস্ক্রিপ্টের বিল্ট-ইন Base64 এনকোডার
                base64Output.textContent = btoa(base64Input.value);
            } catch (e) {
                base64Output.textContent = 'Error: Invalid input for encoding. ' + e.message;
            }
        });
    }

    if (base64DecodeBtn) {
        base64DecodeBtn.addEventListener('click', () => {
            try {
                // atob() হলো জাভাস্ক্রিপ্টের বিল্ট-ইন Base64 ডিকোডার
                base64Output.textContent = atob(base64Input.value);
            } catch (e) {
                base64Output.textContent = 'Error: Invalid Base64 string. ' + e.message;
            }
        });
    }

    // --- Tool 2: URL Encoder/Decoder ---
    const urlInput = document.getElementById('url-input');
    const urlOutput = document.getElementById('url-output');
    const urlEncodeBtn = document.getElementById('url-encode-btn');
    const urlDecodeBtn = document.getElementById('url-decode-btn');

    if (urlEncodeBtn) {
        urlEncodeBtn.addEventListener('click', () => {
            try {
                urlOutput.textContent = encodeURIComponent(urlInput.value);
            } catch (e) {
                urlOutput.textContent = 'Error: ' + e.message;
            }
        });
    }

    if (urlDecodeBtn) {
        urlDecodeBtn.addEventListener('click', () => {
            try {
                urlOutput.textContent = decodeURIComponent(urlInput.value);
            } catch (e) {
                urlOutput.textContent = 'Error: Invalid URL encoding. ' + e.message;
            }
        });
    }

    // --- Tool 3: Hex Encoder/Decoder ---
    const hexInput = document.getElementById('hex-input');
    const hexOutput = document.getElementById('hex-output');
    const hexEncodeBtn = document.getElementById('hex-encode-btn');
    const hexDecodeBtn = document.getElementById('hex-decode-btn');

    if (hexEncodeBtn) {
        hexEncodeBtn.addEventListener('click', () => {
            try {
                let hex = '';
                for (let i = 0; i < hexInput.value.length; i++) {
                    // প্রতিটি ক্যারেক্টারকে তার হেক্স কোডে পরিণত করা
                    const charCode = hexInput.value.charCodeAt(i).toString(16);
                    hex += charCode.padStart(2, '0'); // 'f' কে '0f' বানানো
                }
                hexOutput.textContent = hex;
            } catch (e) {
                hexOutput.textContent = 'Error: ' + e.message;
            }
        });
    }

    if (hexDecodeBtn) {
        hexDecodeBtn.addEventListener('click', () => {
            try {
                let text = '';
                // হেক্স ইনপুটকে দুটি করে ক্যারেক্টারে ভাগ করা (e.g., "4865" -> "48", "65")
                for (let i = 0; i < hexInput.value.length; i += 2) {
                    const hexPair = hexInput.value.substring(i, i + 2);
                    const charCode = parseInt(hexPair, 16);
                    text += String.fromCharCode(charCode);
                }
                hexOutput.textContent = text;
            } catch (e) {
                hexOutput.textContent = 'Error: Invalid Hex string. ' + e.message;
            }
        });
    }
    
    // --- Tool 4: Hash Generator ---
    const hashInput = document.getElementById('hash-input');
    const hashGenerateBtn = document.getElementById('hash-generate-btn');
    const hashOutputContainer = document.getElementById('hash-output-container');
    
    // আউটপুট ফিল্ডগুলো
    const md5Output = document.getElementById('hash-md5');
    const sha1Output = document.getElementById('hash-sha1');
    const sha256Output = document.getElementById('hash-sha256');
    const sha512Output = document.getElementById('hash-sha512');

    if (hashGenerateBtn) {
        hashGenerateBtn.addEventListener('click', () => {
            const input = hashInput.value;
            
            // CryptoJS লাইব্রেরি ব্যবহার করা (HTML-এ লিঙ্ক করা আছে)
            try {
                md5Output.value = CryptoJS.MD5(input).toString();
                sha1Output.value = CryptoJS.SHA1(input).toString();
                sha256Output.value = CryptoJS.SHA256(input).toString();
                sha512Output.value = CryptoJS.SHA512(input).toString();
                
                // ফলাফল দেখানোর জন্য কন্টেইনারটি দৃশ্যমান করা
                hashOutputContainer.style.display = 'block';
            } catch (e) {
                alert('Error generating hashes: ' + e.message);
            }
        });
    }

}); // DOMContentLoaded শেষ
