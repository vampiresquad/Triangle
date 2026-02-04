/*
 * Triangle Generators Logic (PRO UPGRADE)
 * Version: 1.2.0
*/

document.addEventListener('DOMContentLoaded', () => {

/* ================= HELPERS ================= */

const clean=v=>v.trim();

/* Secure Random */
const secureRandom=max=>{
const arr=new Uint32Array(1);
crypto.getRandomValues(arr);
return arr[0]%max;
};

/* Clipboard Safe */
const copyText=async(text)=>{
if(navigator.clipboard){
return navigator.clipboard.writeText(text);
}else{
const t=document.createElement('textarea');
t.value=text;
document.body.appendChild(t);
t.select();
document.execCommand('copy');
document.body.removeChild(t);
}
};

function setupCopyButton(btnId,outId){
const btn=document.getElementById(btnId);
const out=document.getElementById(outId);

if(btn&&out){
btn.addEventListener('click',async()=>{
const txt=out.value||out.textContent;
if(!txt||txt.startsWith('(')||txt.startsWith('Error')){
btn.textContent='Empty!';
setTimeout(()=>btn.textContent='Copy',1500);
return;
}
try{
await copyText(txt);
btn.textContent='Copied!';
}catch{
btn.textContent='Failed';
}
setTimeout(()=>btn.textContent='Copy',1500);
});
}
}

/* ================= PASSWORD ================= */

try{

const passLength=document.getElementById('pass-length');
const passUpper=document.getElementById('pass-uppercase');
const passLower=document.getElementById('pass-lowercase');
const passNumbers=document.getElementById('pass-numbers');
const passSymbols=document.getElementById('pass-symbols');
const passGenerateBtn=document.getElementById('pass-generate-btn');
const passOutput=document.getElementById('pass-output');

const charsets={
upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
lower:'abcdefghijklmnopqrstuvwxyz',
numbers:'0123456789',
symbols:'!@#$%^&*()_+-=[]{}|;:,.<>?'
};

passGenerateBtn.addEventListener('click',()=>{

let charset='';
if(passUpper.checked) charset+=charsets.upper;
if(passLower.checked) charset+=charsets.lower;
if(passNumbers.checked) charset+=charsets.numbers;
if(passSymbols.checked) charset+=charsets.symbols;

if(!charset){
passOutput.value='Error: Select charset';
return;
}

const len=parseInt(passLength.value)||12;

let pass='';
for(let i=0;i<len;i++){
pass+=charset[secureRandom(charset.length)];
}

passOutput.value=pass;

});

setupCopyButton('pass-copy-btn','pass-output');

}catch(e){console.error(e);}

/* ================= WORDLIST ================= */

try{

const wordlistKeywords=document.getElementById('wordlist-keywords');
const wordlistLength=document.getElementById('wordlist-length');
const wordlistGenerateBtn=document.getElementById('wordlist-generate-btn');
const wordlistOutput=document.getElementById('wordlist-output');
const wordlistDownloadBtn=document.getElementById('wordlist-download-btn');

wordlistGenerateBtn.addEventListener('click',()=>{

const keywords=wordlistKeywords.value.split(',')
.map(k=>clean(k))
.filter(Boolean);

const maxLength=parseInt(wordlistLength.value)||2;

/* Safety Limit */
if(keywords.length>10){
wordlistOutput.value='Error: Too many keywords.';
return;
}

let results=new Set(keywords);

keywords.forEach(k=>{
keywords.forEach(k2=>{
if(k.length+k2.length<=50){
results.add(k+k2);
}
});
});

wordlistOutput.value=[...results].join('\n');
wordlistDownloadBtn.disabled=false;

});

wordlistDownloadBtn.addEventListener('click',()=>{
const text=wordlistOutput.value;
if(!text) return;

const blob=new Blob([text],{type:'text/plain'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download='triangle_wordlist.txt';
a.click();
URL.revokeObjectURL(url);
});

}catch(e){console.error(e);}

/* ================= CURL ================= */

try{

const curlUrl=document.getElementById('curl-url');
const curlMethod=document.getElementById('curl-method');
const curlHeaders=document.getElementById('curl-headers');
const curlData=document.getElementById('curl-data');
const curlGenerateBtn=document.getElementById('curl-generate-btn');
const curlOutput=document.getElementById('curl-output');

curlGenerateBtn.addEventListener('click',()=>{

let url=clean(curlUrl.value);
if(!url){
curlOutput.value='Error: URL required';
return;
}

let cmd=`curl -X ${curlMethod.value} "${url}"`;

curlHeaders.value.split('\n').forEach(h=>{
if(clean(h)) cmd+=` \\\n  -H "${clean(h)}"`;
});

if(clean(curlData.value)&&['POST','PUT'].includes(curlMethod.value)){
cmd+=` \\\n  -d '${clean(curlData.value)}'`;
}

curlOutput.value=cmd;

});

setupCopyButton('curl-copy-btn','curl-output');

}catch(e){console.error(e);}

/* ================= REGEX ================= */

try{

const regexInput=document.getElementById('regex-input');
const regexText=document.getElementById('regex-text');
const regexTestBtn=document.getElementById('regex-test-btn');
const regexOutput=document.getElementById('regex-output');

regexTestBtn.addEventListener('click',()=>{

try{

const parts=regexInput.value.match(/^\/(.*)\/([gimsuy]*)$/);
if(!parts) throw new Error('Invalid regex');

const r=new RegExp(parts[1],parts[2]);
const matches=regexText.value.match(r);

regexOutput.textContent=matches
? `Found ${matches.length}\n\n${matches.join('\n')}`
: '(No matches)';

}catch(e){
regexOutput.textContent='Regex Error: '+e.message;
}

});

setupCopyButton('regex-copy-btn','regex-output');

}catch(e){console.error(e);}

/* ================= JSON ================= */

try{

const jsonInput=document.getElementById('json-input');
const jsonFormatBtn=document.getElementById('json-format-btn');
const jsonOutput=document.getElementById('json-output');

jsonFormatBtn.addEventListener('click',()=>{

try{
jsonOutput.textContent=
JSON.stringify(JSON.parse(jsonInput.value),null,2);
}catch(e){
jsonOutput.textContent='Invalid JSON';
}

});

setupCopyButton('json-copy-btn','json-output');

}catch(e){console.error(e);}

/* ================= JWT ================= */

try{

const jwtInput=document.getElementById('jwt-input');
const jwtDecodeBtn=document.getElementById('jwt-decode-btn');
const jwtHeaderOutput=document.getElementById('jwt-header-output');
const jwtPayloadOutput=document.getElementById('jwt-payload-output');

const safeDecode=str=>{
return decodeURIComponent(
escape(atob(str.replace(/-/g,'+').replace(/_/g,'/')))
);
};

jwtDecodeBtn.addEventListener('click',()=>{

try{

const parts=jwtInput.value.split('.');
if(parts.length!==3) throw new Error('Invalid JWT');

jwtHeaderOutput.textContent=
JSON.stringify(JSON.parse(safeDecode(parts[0])),null,2);

jwtPayloadOutput.textContent=
JSON.stringify(JSON.parse(safeDecode(parts[1])),null,2);

}catch(e){
jwtHeaderOutput.textContent='Decode Error';
jwtPayloadOutput.textContent='Decode Error';
}

});

setupCopyButton('jwt-header-copy-btn','jwt-header-output');
setupCopyButton('jwt-payload-copy-btn','jwt-payload-output');

}catch(e){console.error(e);}

});
