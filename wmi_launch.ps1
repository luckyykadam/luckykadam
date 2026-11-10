$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$url = "http://localhost:3000"
$cmd = "`"$edgePath`" `"$url`""

$res = ([wmiclass]"win32_process").Create($cmd)
Write-Output "Return code: $($res.ReturnValue), ProcessId: $($res.ProcessId)"
