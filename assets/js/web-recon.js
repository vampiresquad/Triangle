/*
 * Triangle - Web Recon Logic (PRO UPGRADE)
 * Version: 1.1.0
*/

document.addEventListener('DOMContentLoaded', () => {

/* ================= HELPERS ================= */

const clean = v => v.trim();

const normalizeUrl = url => {
if (!/^https?:\/\//i.test(url)) return 'https://' + url;
return url;
};

const extractDomain = url => {
try {
return new URL(normalizeUrl(url)).hostname;
} catch {
return url.replace(/^https?:\/\//,'').split('/')[0];
}
};

const fetchWithTimeout = (url, timeout=10000) => {
return Promise.race([
fetch(url),
new Promise((_,reject)=>
setTimeout(()=>reject(new Error('Request timeout')),timeout)
)
]);
};

/* ================= HEADER VIEWER ================= */

const headerInput=document.getElementById('header-input');
const headerFetchBtn=document.getElementById('header-fetch-btn');
const headerOutput=document.getElementById('header-output');
const headerLoader=document.getElementById('header-loader');

const CORS_PROXY='https://api.allorigins.win/raw?url=';

if(headerFetchBtn){
headerFetchBtn.addEventListener('click',async()=>{

let targetUrl=clean(headerInput.value);
if(!targetUrl){
headerOutput.textContent='Error: Please enter a URL.';
return;
}

targetUrl=normalizeUrl(targetUrl);

headerLoader.style.display='block';
headerFetchBtn.setAttribute('aria-busy','true');
headerOutput.textContent='Fetching headers...';

try{

const proxyUrl=`${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
const response=await fetchWithTimeout(proxyUrl,12000);

let headersText='';
for(const [k,v] of response.headers.entries()){
headersText+=`${k}: ${v}\n`;
}

headerOutput.textContent=headersText||'No headers found.';

}catch(e){
headerOutput.textContent='Error: Failed to fetch headers.\n'+e.message;
}finally{
headerLoader.style.display='none';
headerFetchBtn.setAttribute('aria-busy','false');
}

});
}

/* ================= SUBDOMAIN FINDER ================= */

const subdomainInput=document.getElementById('subdomain-input');
const subdomainFetchBtn=document.getElementById('subdomain-fetch-btn');
const subdomainOutput=document.getElementById('subdomain-output');
const subdomainLoader=document.getElementById('subdomain-loader');

if(subdomainFetchBtn){
subdomainFetchBtn.addEventListener('click',async()=>{

let domain=clean(subdomainInput.value);
if(!domain){
subdomainOutput.value='Error: Please enter a domain.';
return;
}

domain=extractDomain(domain);

subdomainLoader.style.display='block';
subdomainFetchBtn.setAttribute('aria-busy','true');
subdomainOutput.value='Searching subdomains...';

const apiUrl=`https://crt.sh/?q=%.${domain}&output=json`;

try{

const res=await fetchWithTimeout(apiUrl,15000);
if(!res.ok) throw new Error('crt.sh API failed');

const data=await res.json();

if(!data.length){
subdomainOutput.value='No subdomains found.';
return;
}

const domains=new Set();

data.forEach(item=>{
item.name_value.split('\n').forEach(name=>{
const n=name.trim().toLowerCase();
if(n===domain||n.endsWith('.'+domain)){
domains.add(n);
}
});
});

subdomainOutput.value=[...domains].sort().join('\n');

}catch(e){
subdomainOutput.value='Error fetching subdomains:\n'+e.message;
}finally{
subdomainLoader.style.display='none';
subdomainFetchBtn.setAttribute('aria-busy','false');
}

});
}

/* ================= URL PARSER ================= */

const urlParserInput=document.getElementById('url-parser-input');
const urlParseBtn=document.getElementById('url-parse-btn');

const urlProtocol=document.getElementById('url-protocol');
const urlHost=document.getElementById('url-host');
const urlPort=document.getElementById('url-port');
const urlPath=document.getElementById('url-path');
const urlQuery=document.getElementById('url-query');
const urlFragment=document.getElementById('url-fragment');

if(urlParseBtn){
urlParseBtn.addEventListener('click',()=>{

let fullUrl=clean(urlParserInput.value);
if(!fullUrl){
alert('Enter URL to parse');
return;
}

try{

const url=new URL(normalizeUrl(fullUrl));

urlProtocol.value=url.protocol;
urlHost.value=url.hostname;
urlPort.value=url.port||'(default)';
urlPath.value=url.pathname;
urlQuery.value=url.search||'(none)';
urlFragment.value=url.hash||'(none)';

}catch(e){

alert('Invalid URL');

[urlProtocol,urlHost,urlPort,urlPath,urlQuery,urlFragment]
.forEach(f=>f.value='');

}

});
}

});
