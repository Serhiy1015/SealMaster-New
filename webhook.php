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

chdir($repo);
exec('git pull origin main 2>&1', $out1, $code1);
exec("cp -rf {$repo}/. {$dest}/ 2>&1", $out2, $code2);

http_response_code(200);
echo "pull: " . ($code1 === 0 ? 'OK' : 'FAIL') . "\n";
echo implode("\n", $out1) . "\n";
echo "copy: " . ($code2 === 0 ? 'OK' : 'FAIL') . "\n";
