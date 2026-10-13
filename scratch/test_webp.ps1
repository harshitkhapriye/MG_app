[void][System.Reflection.Assembly]::LoadWithPartialName('System.Drawing')
try {
    $img = [System.Drawing.Image]::FromFile("assets\ecomm\images\newarrived\bngl_17.webp")
    Write-Output "WebP loaded successfully!"
    $img.Dispose()
} catch {
    Write-Output ("WebP error: " + $_.Exception.Message)
}
