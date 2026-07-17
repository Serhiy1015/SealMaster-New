<?php
$secret  = '2fce00cad25248e02f3633ed92221e0d4a3aba97';
$payload = file_get_contents('php://input');
$hubSig  = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$calcSig = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!hash_equals($calcSig, $hubSig)) {
    http_response_code(403);
    die('Unauthorized');
}

$data = json_decode($payload, true);
if (($data['ref'] ?? '') !== 'refs/heads/main') {
    echo 'Not main, skipping.';
    exit;
}

$repo = '/home/silmastercom/repositories/SealMaster-New';
$dest = '/home/silmastercom/public_html';

putenv('HOME=/home/silmastercom');
putenv('GIT_TERMINAL_PROMPT=0');
putenv('GIT_ASKPASS=echo');

chdir($repo);
exec("whoami 2>&1", $who);
exec("timeout 30 /usr/bin/git -C {$repo} fetch origin main 2>&1", $out1f, $code1f);
exec("timeout 30 /usr/bin/git -C {$repo} reset --hard origin/main 2>&1", $out1r, $code1r);
$code1 = ($code1f === 0 && $code1r === 0) ? 0 : 1;
$out1  = array_merge($out1f, $out1r);
exec("/bin/cp -rf {$repo}/. {$dest}/ 2>&1", $out2, $code2);

http_response_code(200);
echo "user: " . implode('', $who) . "\n";
echo "fetch: " . ($code1f === 0 ? 'OK' : 'FAIL') . "\n";
echo "reset: " . ($code1r === 0 ? 'OK' : 'FAIL') . "\n";
echo implode("\n", $out1) . "\n";
echo "copy: " . ($code2 === 0 ? 'OK' : 'FAIL') . "\n";
echo implode("\n", $out2) . "\n";
