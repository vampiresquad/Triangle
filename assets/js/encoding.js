/*
 * Triangle - Encoding & Hashing Page Logic (PRO UPGRADE)
 * Author: Muhammad Shourov
 * Version: 1.1.0
*/

document.addEventListener('DOMContentLoaded', () => {

/* ================= SAFE HELPERS ================= */

// Unicode Safe Base64
const safeBtoa = str => btoa(unescape(encodeURIComponent(str)));
const safeAtob = str => decodeURIComponent(escape(atob(str)));

// Clean Input
const clean = v => v.trim();

/* ================= BASE64 ================= */

const base64Input = document.getElementById('base64-input');
const base64Output = document.getElementById('base64-output');
const base64EncodeBtn = document.getElementById('base64-encode-btn');
const base64DecodeBtn = document.getElementById('base64-decode-btn');

if (base64EncodeBtn) {
base64EncodeBtn.addEventListener('click', () => {
try {
const val = clean(base64Input.value);
base64Output.textContent = safeBtoa(val);
} catch (e) {
base64Output.textContent = 'Error: Invalid input for encoding.';
}
});
}

if (base64DecodeBtn) {
base64DecodeBtn.addEventListener('click', () => {
try {
const val = clean(base64Input.value);
base64Output.textContent = safeAtob(val);
} catch (e) {
base64Output.textContent = 'Error: Invalid Base64 string.';
}
});
}

/* ================= URL ================= */

const urlInput = document.getElementById('url-input');
const urlOutput = document.getElementById('url-output');
const urlEncodeBtn = document.getElementById('url-encode-btn');
const urlDecodeBtn = document.getElementById('url-decode-btn');

if (urlEncodeBtn) {
urlEncodeBtn.addEventListener('click', () => {
try {
urlOutput.textContent = encodeURIComponent(clean(urlInput.value));
} catch (e) {
urlOutput.textContent = 'Error: Encoding failed.';
}
});
}

if (urlDecodeBtn) {
urlDecodeBtn.addEventListener('click', () => {
try {
urlOutput.textContent = decodeURIComponent(clean(urlInput.value));
} catch (e) {
urlOutput.textContent = 'Error: Invalid URL encoding.';
}
});
}

/* ================= HEX ================= */

const hexInput = document.getElementById('hex-input');
const hexOutput = document.getElementById('hex-output');
const hexEncodeBtn = document.getElementById('hex-encode-btn');
const hexDecodeBtn = document.getElementById('hex-decode-btn');

if (hexEncodeBtn) {
hexEncodeBtn.addEventListener('click', () => {
try {
const val = clean(hexInput.value);
let hex = '';
for (let i = 0; i < val.length; i++) {
hex += val.charCodeAt(i).toString(16).padStart(2, '0');
}
hexOutput.textContent = hex;
} catch (e) {
hexOutput.textContent = 'Error: Encoding failed.';
}
});
}

if (hexDecodeBtn) {
hexDecodeBtn.addEventListener('click', () => {
try {
const val = clean(hexInput.value);

if (val.length % 2 !== 0) {
hexOutput.textContent = 'Error: Invalid hex length.';
return;
}

let text = '';
for (let i = 0; i < val.length; i += 2) {
text += String.fromCharCode(parseInt(val.substr(i, 2), 16));
}

hexOutput.textContent = text;

} catch (e) {
hexOutput.textContent = 'Error: Invalid hex string.';
}
});
}

/* ================= HASH ================= */

const hashInput = document.getElementById('hash-input');
const hashGenerateBtn = document.getElementById('hash-generate-btn');
const hashOutputContainer = document.getElementById('hash-output-container');

const md5Output = document.getElementById('hash-md5');
const sha1Output = document.getElementById('hash-sha1');
const sha256Output = document.getElementById('hash-sha256');
const sha512Output = document.getElementById('hash-sha512');

if (hashGenerateBtn) {
hashGenerateBtn.addEventListener('click', () => {

try {

const input = clean(hashInput.value);

if (!input) {
alert('Please enter text to hash.');
return;
}

md5Output.value = CryptoJS.MD5(input).toString();
sha1Output.value = CryptoJS.SHA1(input).toString();
sha256Output.value = CryptoJS.SHA256(input).toString();
sha512Output.value = CryptoJS.SHA512(input).toString();

hashOutputContainer.style.display = 'block';

} catch (e) {
alert('Hash generation failed.');
}

});
}

});
