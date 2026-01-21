# Test script to verify site accessibility for crawlers

Write-Host "Testing site accessibility for markhazleton.com..." -ForegroundColor Cyan

# Test 1: Basic HTTP request
Write-Host "`n=== Test 1: Basic HTTP Request ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://markhazleton.com" -UseBasicParsing
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content Length: $($response.Content.Length) bytes" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Check with common crawler user-agent
Write-Host "`n=== Test 2: Simulating Googlebot ===" -ForegroundColor Yellow
try {
    $headers = @{
        'User-Agent' = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
    $response = Invoke-WebRequest -Uri "https://markhazleton.com" -Headers $headers -UseBasicParsing
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Check robots.txt
Write-Host "`n=== Test 3: Checking robots.txt ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://markhazleton.com/robots.txt" -UseBasicParsing
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content:`n$($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Check sitemap
Write-Host "`n=== Test 4: Checking sitemap.xml ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://markhazleton.com/sitemap.xml" -UseBasicParsing
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Sitemap size: $($response.Content.Length) bytes" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Check response headers
Write-Host "`n=== Test 5: Response Headers ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://markhazleton.com" -UseBasicParsing
    $response.Headers.GetEnumerator() | ForEach-Object {
        Write-Host "$($_.Key): $($_.Value)" -ForegroundColor Gray
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Cyan
