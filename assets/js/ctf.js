/*
 * Triangle CTF / Forensics Logic (PRO UPGRADE)
 * Version: 1.1.0
*/

document.addEventListener('DOMContentLoaded', () => {

/* ================= HELPERS ================= */

const clean=v=>v.trim();

const normalizeShift=s=>{
let n=parseInt(s)||0;
return ((n%26)+26)%26;
};

/* ================= CLASSIC CIPHERS ================= */

try{

const cipherInput=document.getElementById('cipher-input');
const cipherType=document.getElementById('cipher-type');
const caesarShift=document.getElementById('caesar-shift');
const caesarShiftLabel=document.getElementById('caesar-shift-label');
const encodeBtn=document.getElementById('cipher-encode-btn');
const decodeBtn=document.getElementById('cipher-decode-btn');
const cipherOutput=document.getElementById('cipher-output');

function shiftCipher(text,shift){
return text.replace(/[a-zA-Z]/g,c=>{
const base=c.charCodeAt(0)<97?65:97;
let code=(c.charCodeAt(0)-base+shift)%26;
if(code<0) code+=26;
return String.fromCharCode(code+base);
});
}

cipherType.addEventListener('change',()=>{
if(cipherType.value==='caesar'){
caesarShift.style.display='block';
caesarShiftLabel.style.display='block';
}else{
caesarShift.style.display='none';
caesarShiftLabel.style.display='none';
}
});

encodeBtn.addEventListener('click',()=>{
const text=clean(cipherInput.value);
let shift=13;

if(cipherType.value==='caesar'){
shift=normalizeShift(caesarShift.value);
}

cipherOutput.textContent=shiftCipher(text,shift);
});

decodeBtn.addEventListener('click',()=>{
const text=clean(cipherInput.value);
let shift=-13;

if(cipherType.value==='caesar'){
shift=-normalizeShift(caesarShift.value);
}

cipherOutput.textContent=shiftCipher(text,shift);
});

}catch(e){console.error(e);}

/* ================= EXIF VIEWER ================= */

try{

const fileInput=document.getElementById('exif-file-input');
const output=document.getElementById('exif-output');

fileInput.addEventListener('change',e=>{

const file=e.target.files[0];
if(!file){
output.textContent='(No file)';
return;
}

/* JPEG Variants Support */
if(!file.type.includes('jpeg')){
output.textContent='Error: JPEG image required.';
return;
}

/* Library Safety */
if(typeof EXIF==='undefined'){
output.textContent='Error: EXIF library missing.';
return;
}

output.textContent='Reading EXIF...';

EXIF.getData(file,function(){

const tags=EXIF.getAllTags(this);

if(!Object.keys(tags).length){
output.textContent='No EXIF found.';
return;
}

let result='';
for(const t in tags){
result+=`${t}: ${tags[t]}\n`;
}

output.textContent=result;

});

});

}catch(e){console.error(e);}

/* ================= STRINGS EXTRACTOR ================= */

try{

const stringsFileInput=document.getElementById('strings-file-input');
const stringsExtractBtn=document.getElementById('strings-extract-btn');
const stringsOutput=document.getElementById('strings-output');

stringsExtractBtn.addEventListener('click',()=>{

const file=stringsFileInput.files[0];

if(!file){
stringsOutput.value='Select file first.';
return;
}

/* Safety Limit */
if(file.size>5*1024*1024){
stringsOutput.value='Error: File too large (>5MB)';
return;
}

stringsExtractBtn.setAttribute('aria-busy','true');
stringsOutput.value='Processing...';

const reader=new FileReader();

reader.onload=e=>{

const bytes=new Uint8Array(e.target.result);

let res='';
let cur='';
const minLen=4;

for(let i=0;i<bytes.length;i++){

const c=bytes[i];

if(c>=32 && c<=126){
cur+=String.fromCharCode(c);
}else{
if(cur.length>=minLen) res+=cur+'\n';
cur='';
}

}

if(cur.length>=minLen) res+=cur;

stringsOutput.value=res||'(No strings)';
stringsExtractBtn.setAttribute('aria-busy','false');

};

reader.onerror=()=>{
stringsOutput.value='File read error';
stringsExtractBtn.setAttribute('aria-busy','false');
};

reader.readAsArrayBuffer(file);

});

}catch(e){console.error(e);}

});
