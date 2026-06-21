$files = Get-ChildItem 'public/assets/images' -Recurse -Filter '*.png' | Where-Object { $_.Length -lt 8000 }
foreach ($f in $files) {
    $kb = [math]::Round($f.Length / 1KB, 1)
    Write-Host "$($f.FullName) | $($f.Length) bytes | ${kb}KB"
}
Write-Host "--- Total: $($files.Count) files ---"
