# 🧪 اختبار Social Media API Endpoints

Write-Host "🚀 بدء اختبار الـ Endpoints..." -ForegroundColor Green

# 1. اختبار الصفحة الرئيسية
Write-Host "`n1. اختبار الصفحة الرئيسية..." -ForegroundColor Yellow
try {
    $home = Invoke-RestMethod -Uri "http://localhost:4000/" -Method GET
    Write-Host "✅ الصفحة الرئيسية تعمل!" -ForegroundColor Green
    Write-Host "Message: $($home.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ خطأ في الصفحة الرئيسية: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. اختبار تسجيل الدخول
Write-Host "`n2. اختبار تسجيل الدخول..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "ahmed@example.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResult = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "✅ تسجيل الدخول نجح!" -ForegroundColor Green
    Write-Host "User: $($loginResult.user.username)" -ForegroundColor Cyan
    Write-Host "Token: $($loginResult.token.Substring(0,50))..." -ForegroundColor Cyan
    
    # حفظ التوكن للاختبارات التالية
    $global:authToken = $loginResult.token
    
} catch {
    Write-Host "❌ خطأ في تسجيل الدخول: $($_.Exception.Message)" -ForegroundColor Red
    return
}

# 3. اختبار GraphQL Query
Write-Host "`n3. اختبار GraphQL Query..." -ForegroundColor Yellow
try {
    $graphqlQuery = @{
        query = "query { allPosts(limit: 3) { id platform content likes author createdBy { username } } }"
    } | ConvertTo-Json

    $headers = @{
        "Authorization" = "Bearer $global:authToken"
        "Content-Type" = "application/json"
    }

    $graphqlResult = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Headers $headers -Body $graphqlQuery
    Write-Host "✅ GraphQL Query نجح!" -ForegroundColor Green
    Write-Host "عدد المنشورات: $($graphqlResult.data.allPosts.Count)" -ForegroundColor Cyan
    
    # عرض أول منشور
    if ($graphqlResult.data.allPosts.Count -gt 0) {
        $firstPost = $graphqlResult.data.allPosts[0]
        Write-Host "أول منشور:" -ForegroundColor Cyan
        Write-Host "  - المنصة: $($firstPost.platform)" -ForegroundColor White
        Write-Host "  - المحتوى: $($firstPost.content.Substring(0, [Math]::Min(50, $firstPost.content.Length)))..." -ForegroundColor White
        Write-Host "  - الإعجابات: $($firstPost.likes)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ خطأ في GraphQL: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. اختبار إضافة منشور جديد
Write-Host "`n4. اختبار إضافة منشور جديد..." -ForegroundColor Yellow
try {
    $addPostMutation = @{
        query = 'mutation { addPost(input: { platform: "Twitter", contentType: "TWEET", content: "منشور تجريبي جديد! 🚀 #تطوير #PowerShell" }) { id content platform likes author createdBy { username } } }'
    } | ConvertTo-Json

    $addPostResult = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Headers $headers -Body $addPostMutation
    Write-Host "✅ إضافة منشور نجحت!" -ForegroundColor Green
    
    if ($addPostResult.data.addPost) {
        $newPost = $addPostResult.data.addPost
        Write-Host "المنشور الجديد:" -ForegroundColor Cyan
        Write-Host "  - ID: $($newPost.id)" -ForegroundColor White
        Write-Host "  - المحتوى: $($newPost.content)" -ForegroundColor White
        Write-Host "  - المنصة: $($newPost.platform)" -ForegroundColor White
        Write-Host "  - المؤلف: $($newPost.createdBy.username)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ خطأ في إضافة المنشور: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. اختبار المستخدم الحالي
Write-Host "`n5. اختبار المستخدم الحالي..." -ForegroundColor Yellow
try {
    $meQuery = @{
        query = "query { me { id username email createdAt } }"
    } | ConvertTo-Json

    $meResult = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Headers $headers -Body $meQuery
    Write-Host "✅ استعلام المستخدم نجح!" -ForegroundColor Green
    
    if ($meResult.data.me) {
        $user = $meResult.data.me
        Write-Host "بيانات المستخدم الحالي:" -ForegroundColor Cyan
        Write-Host "  - الاسم: $($user.username)" -ForegroundColor White
        Write-Host "  - الإيميل: $($user.email)" -ForegroundColor White
        Write-Host "  - تاريخ الإنشاء: $($user.createdAt)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ خطأ في استعلام المستخدم: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 انتهاء الاختبار!" -ForegroundColor Green
Write-Host "📍 يمكنك الآن استخدام:" -ForegroundColor Yellow
Write-Host "  - GraphQL Playground: http://localhost:4000/graphql" -ForegroundColor Cyan
Write-Host "  - REST API: http://localhost:4000/auth" -ForegroundColor Cyan 