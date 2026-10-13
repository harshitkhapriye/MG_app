[void][System.Reflection.Assembly]::LoadWithPartialName('System.Drawing')

$srcPath = "C:\Users\harsh\OneDrive\Desktop\MG_app\scratch\candidates\kids_bangles_asset.png"
$dstPath = "C:\Users\harsh\OneDrive\Desktop\MG_app\scratch\candidates\kids_bangles_asset.jpg"

$src = [System.Drawing.Image]::FromFile($srcPath)
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)

$src.Save($dstPath, $codec, $encoderParams)
$src.Dispose()

$sizeKB = (Get-Item $dstPath).Length / 1KB
Write-Output "Created $dstPath ($([Math]::Round($sizeKB, 1)) KB)"
