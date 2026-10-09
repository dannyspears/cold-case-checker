$root = (Get-Location).Path
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:5617/")
$l.Start()
Write-Host "Serving on http://localhost:5617"
$types = @{ ".html"="text/html; charset=utf-8"; ".js"="text/javascript; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".webp"="image/webp"; ".svg"="image/svg+xml" }
while ($l.IsListening) {
  $c = $l.GetContext()
  $path = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath)
  if ($path.EndsWith("/")) { $path += "index.html" }
  $fp = Join-Path $root ($path.TrimStart("/") -replace "/", "\")
  if ((Test-Path $fp -PathType Leaf) -and $fp.StartsWith($root)) {
    $b = [IO.File]::ReadAllBytes($fp)
    $ext = [IO.Path]::GetExtension($fp)
    $c.Response.ContentType = if ($types[$ext]) { $types[$ext] } else { "application/octet-stream" }
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
