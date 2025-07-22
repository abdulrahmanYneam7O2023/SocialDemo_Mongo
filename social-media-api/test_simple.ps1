# Simple GraphQL Endpoints Test
Write-Host "Testing GraphQL Endpoints..." -ForegroundColor Cyan

$baseUrl = "http://localhost:4000/graphql"
$headers = @{"Content-Type" = "application/json"}
$results = @{}

# Test 1: allPosts
Write-Host "1. Testing allPosts..." -ForegroundColor Yellow
$query1 = '{"query":"{allPosts{id platform content likes author}}"}'
try {
    $response1 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $query1
    if ($response1.data.allPosts) {
        Write-Host "SUCCESS - allPosts: Found $($response1.data.allPosts.Count) posts" -ForegroundColor Green
        $results["allPosts"] = "SUCCESS"
    } else {
        Write-Host "FAILED - allPosts: No data" -ForegroundColor Red
        $results["allPosts"] = "FAILED"
    }
} catch {
    Write-Host "ERROR - allPosts: $($_.Exception.Message)" -ForegroundColor Red
    $results["allPosts"] = "ERROR"
}

# Test 2: postsByPlatform
Write-Host "2. Testing postsByPlatform..." -ForegroundColor Yellow
$query2 = '{"query":"query{postsByPlatform(platform:\"Instagram\"){id content platform}}"}'
try {
    $response2 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $query2
    if ($response2.data.postsByPlatform) {
        Write-Host "SUCCESS - postsByPlatform: Found $($response2.data.postsByPlatform.Count) Instagram posts" -ForegroundColor Green
        $results["postsByPlatform"] = "SUCCESS"
    } else {
        Write-Host "FAILED - postsByPlatform" -ForegroundColor Red
        $results["postsByPlatform"] = "FAILED"
    }
} catch {
    Write-Host "ERROR - postsByPlatform: $($_.Exception.Message)" -ForegroundColor Red
    $results["postsByPlatform"] = "ERROR"
}

# Test 3: me
Write-Host "3. Testing me..." -ForegroundColor Yellow
$query3 = '{"query":"query{me{id username email}}"}'
try {
    $response3 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $query3
    if ($response3.data.me) {
        Write-Host "SUCCESS - me: User $($response3.data.me.username)" -ForegroundColor Green
        $results["me"] = "SUCCESS"
    } else {
        Write-Host "FAILED - me" -ForegroundColor Red
        $results["me"] = "FAILED"
    }
} catch {
    Write-Host "ERROR - me: $($_.Exception.Message)" -ForegroundColor Red
    $results["me"] = "ERROR"
}

# Test 4: addPost
Write-Host "4. Testing addPost..." -ForegroundColor Yellow
$mutation1 = '{"query":"mutation{addPost(input:{platform:\"Twitter\",contentType:\"TWEET\",content:\"Test post!\",author:\"test_user\"}){id platform content}}"}'
try {
    $response4 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $mutation1
    if ($response4.data.addPost) {
        Write-Host "SUCCESS - addPost: Created post $($response4.data.addPost.id)" -ForegroundColor Green
        $results["addPost"] = "SUCCESS"
        $newPostId = $response4.data.addPost.id
    } else {
        Write-Host "FAILED - addPost" -ForegroundColor Red
        $results["addPost"] = "FAILED"
    }
} catch {
    Write-Host "ERROR - addPost: $($_.Exception.Message)" -ForegroundColor Red
    $results["addPost"] = "ERROR"
}

# Test 5: analyticsByContent
Write-Host "5. Testing analyticsByContent..." -ForegroundColor Yellow
$query4 = '{"query":"query{analyticsByContent(contentId:\"post_1\"){id platform metrics{likes impressions}}}"}'
try {
    $response5 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $query4
    if ($response5.data.analyticsByContent) {
        Write-Host "SUCCESS - analyticsByContent: Found $($response5.data.analyticsByContent.Count) analytics" -ForegroundColor Green
        $results["analyticsByContent"] = "SUCCESS"
    } else {
        Write-Host "FAILED - analyticsByContent" -ForegroundColor Red
        $results["analyticsByContent"] = "FAILED"
    }
} catch {
    Write-Host "ERROR - analyticsByContent: $($_.Exception.Message)" -ForegroundColor Red
    $results["analyticsByContent"] = "ERROR"
}

# Test 6: updatePost
Write-Host "6. Testing updatePost..." -ForegroundColor Yellow
$mutation2 = '{"query":"mutation{updatePost(id:\"post_1\",input:{content:\"Updated content!\"}){id content}}"}'
try {
    $response6 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $mutation2
    if ($response6.data.updatePost) {
        Write-Host "SUCCESS - updatePost: Updated to '$($response6.data.updatePost.content)'" -ForegroundColor Green
        $results["updatePost"] = "SUCCESS"
    } else {
        Write-Host "FAILED - updatePost" -ForegroundColor Red
        $results["updatePost"] = "FAILED"
    }
} catch {
    Write-Host "ERROR - updatePost: $($_.Exception.Message)" -ForegroundColor Red
    $results["updatePost"] = "ERROR"
}

# Test 7: Homepage
Write-Host "7. Testing Homepage..." -ForegroundColor Yellow
try {
    $response7 = Invoke-RestMethod -Uri "http://localhost:4000" -Method GET
    if ($response7.message) {
        Write-Host "SUCCESS - Homepage: $($response7.message)" -ForegroundColor Green
        $results["homepage"] = "SUCCESS"
    } else {
        Write-Host "FAILED - Homepage" -ForegroundColor Red
        $results["homepage"] = "FAILED"
    }
} catch {
    Write-Host "ERROR - Homepage: $($_.Exception.Message)" -ForegroundColor Red
    $results["homepage"] = "ERROR"
}

# Summary
Write-Host "`nTest Results Summary:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

$successCount = 0
$totalCount = $results.Count

foreach ($endpoint in $results.Keys) {
    $status = $results[$endpoint]
    Write-Host "- $endpoint : $status"
    if ($status -eq "SUCCESS") { $successCount++ }
}

Write-Host "`nStatistics:" -ForegroundColor Cyan
Write-Host "Success: $successCount/$totalCount"
Write-Host "Success Rate: $([math]::Round(($successCount/$totalCount)*100, 2))%"

if ($successCount -eq $totalCount) {
    Write-Host "`nAll endpoints working without authentication!" -ForegroundColor Green
} else {
    Write-Host "`nSome endpoints need review!" -ForegroundColor Yellow
} 