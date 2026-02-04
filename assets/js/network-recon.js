/*
 * Triangle - Network Recon Logic (PRO UPGRADE)
 * Version: 1.1.0
*/

document.addEventListener('DOMContentLoaded', () => {

/* ================= HELPERS ================= */

const clean = v => v.trim();

const fetchWithTimeout = (url, timeout=12000) => {
return Promise.race([
fetch(url),
new Promise((_,reject)=>
setTimeout(()=>reject(new Error('Request timeout')),timeout)
)
]);
};

const normalizeDomain = d => {
return d.replace(/^https?:\/\//,'').split('/')[0];
};

const isValidIP = ip => {
const ipv4=/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
return ipv4.test(ip);
};

/* ================= IP LOOKUP ================= */

const ipInput=document.getElementById('ip-input');
const ipFetchBtn=document.getElementById('ip-fetch-btn');
const ipOutput=document.getElementById('ip-output');
const ipLoader=document.getElementById('ip-loader');

if(ipFetchBtn){
ipFetchBtn.addEventListener('click',async()=>{

const ip=clean(ipInput.value);

if(!ip){
ipOutput.textContent='Error: Enter IP address.';
return;
}

if(!isValidIP(ip)){
ipOutput.textContent='Error: Invalid IPv4 format.';
return;
}

ipLoader.style.display='block';
ipFetchBtn.setAttribute('aria-busy','true');
ipOutput.textContent='Fetching IP info...';

/* HTTPS SAFE API */
const apiUrl=`https://ipapi.co/${ip}/json/`;

try{

const res=await fetchWithTimeout(apiUrl,15000);
const data=await res.json();

if(data.error){
throw new Error(data.reason||'IP lookup failed');
}

ipOutput.textContent=JSON.stringify(data,null,2);

}catch(e){
ipOutput.textContent='Error fetching IP info:\n'+e.message;
}finally{
ipLoader.style.display='none';
ipFetchBtn.setAttribute('aria-busy','false');
}

});
}

/* ================= DNS LOOKUP ================= */

const dnsInput=document.getElementById('dns-input');
const dnsFetchBtn=document.getElementById('dns-fetch-btn');
const dnsOutput=document.getElementById('dns-output');
const dnsLoader=document.getElementById('dns-loader');

if(dnsFetchBtn){
dnsFetchBtn.addEventListener('click',async()=>{

let domain=clean(dnsInput.value);

if(!domain){
dnsOutput.textContent='Error: Enter domain.';
return;
}

domain=normalizeDomain(domain);

dnsLoader.style.display='block';
dnsFetchBtn.setAttribute('aria-busy','true');
dnsOutput.textContent='Fetching DNS records...';

const apiUrl=`https://dns.google/resolve?name=${domain}`;

try{

const res=await fetchWithTimeout(apiUrl,15000);
const data=await res.json();

dnsOutput.textContent=JSON.stringify(data,null,2);

}catch(e){
dnsOutput.textContent='Error fetching DNS:\n'+e.message;
}finally{
dnsLoader.style.display='none';
dnsFetchBtn.setAttribute('aria-busy','false');
}

});
}

});
