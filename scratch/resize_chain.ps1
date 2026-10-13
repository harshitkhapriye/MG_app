[void][System.Reflection.Assembly]::LoadWithPartialName('System.Drawing')

function Resize-ToPortrait($srcPath, $dstPath, $targetW = 800, $targetH = 1000) {
    $src = [System.Drawing.Image]::FromFile($srcPath)
    
    # Calculate fit within 800x1000 with white background
    $bitmap = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::White)

    # Scale to fill or fit
    $scale = [Math]::Max($targetW / $src.Width, $targetH / $src.Height)
    $w = [int]($src.Width * $scale)
    $h = [int]($src.Height * $scale)
    $x = [int](($targetW - $w) / 2)
    $y = [int](($targetH - $h) / 2)

    $g.DrawImage($src, $x, $y, $w, $h)
    $g.Dispose()
    $src.Dispose()

    # Save as JPEG with quality 82
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)

    $bitmap.Save($dstPath, $codec, $encoderParams)
    $bitmap.Dispose()

    $sizeKB = (Get-Item $dstPath).Length / 1KB
    Write-Output "Created $dstPath ($([Math]::Round($sizeKB, 1)) KB, ${targetW}x${targetH})"
}

Resize-ToPortrait "assets\ecomm\images\newarrived\chain_2.jpg" "scratch\candidates\men_chain_asset.jpg"
