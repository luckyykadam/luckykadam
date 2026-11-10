$url = "http://localhost:3000"
$filePath = "c:\Users\lucky kadam\Documents\portfolio\index.html"

# Try opening via Start-Process
Start-Process "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" -ArgumentList "--new-window", "$url"

# Also try opening default handler
Start-Process "$url"

Write-Output "Browser launch commands executed successfully."
