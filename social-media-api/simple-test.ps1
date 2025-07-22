Write-Host "🚀 اختبار بسيط للـ API" -ForegroundColor Green

# تسجيل الدخول
$loginBody = @{
    email = "user1@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResult = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "✅ تسجيل الدخول نجح!" -ForegroundColor Green
    Write-Host "المستخدم: $($loginResult.user.username)" -ForegroundColor Cyan
    
    # اختبار GraphQL
    $graphqlQuery = @{
        query = "query { allPosts(limit: 2) { id platform content likes } }"
    } | ConvertTo-Json

    $headers = @{
        "Authorization" = "Bearer $($loginResult.token)"
        "Content-Type" = "application/json"
    }

    $graphqlResult = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Headers $headers -Body $graphqlQuery
    Write-Host "✅ GraphQL نجح!" -ForegroundColor Green
    Write-Host "عدد المنشورات: $($graphqlResult.data.allPosts.Count)" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ خطأ: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "انتهى الاختبار" -ForegroundColor Green 