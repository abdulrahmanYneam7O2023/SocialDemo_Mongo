# اختبار شامل لجميع GraphQL Endpoints
Write-Host "🧪 بدء اختبار جميع الـ Endpoints..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:4000/graphql"
$headers = @{"Content-Type" = "application/json"}
$results = @{}

# Test 1: allPosts
Write-Host "`n1️⃣ اختبار allPosts..." -ForegroundColor Yellow
$query1 = '{"query":"{allPosts{id platform content likes author}}"}'
try {
    $response1 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $query1
    if ($response1.data.allPosts) {
        Write-Host "✅ allPosts - نجح! عدد المنشورات: $($response1.data.allPosts.Count)" -ForegroundColor Green
        $results["allPosts"] = "✅ نجح"
    } else {
        Write-Host "❌ allPosts - فشل! لا توجد بيانات" -ForegroundColor Red
        $results["allPosts"] = "❌ فشل"
    }
} catch {
    Write-Host "❌ allPosts - خطأ: $($_.Exception.Message)" -ForegroundColor Red
    $results["allPosts"] = "❌ خطأ"
}

# Test 2: postsByPlatform
Write-Host "`n2️⃣ اختبار postsByPlatform..." -ForegroundColor Yellow
$query2 = '{"query":"query{postsByPlatform(platform:\"Instagram\"){id content platform}}"}'
try {
    $response2 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $query2
    if ($response2.data.postsByPlatform) {
        Write-Host "✅ postsByPlatform - نجح! عدد منشورات Instagram: $($response2.data.postsByPlatform.Count)" -ForegroundColor Green
        $results["postsByPlatform"] = "✅ نجح"
    } else {
        Write-Host "❌ postsByPlatform - فشل!" -ForegroundColor Red
        $results["postsByPlatform"] = "❌ فشل"
    }
} catch {
    Write-Host "❌ postsByPlatform - خطأ: $($_.Exception.Message)" -ForegroundColor Red
    $results["postsByPlatform"] = "❌ خطأ"
}

# Test 3: me
Write-Host "`n3️⃣ اختبار me..." -ForegroundColor Yellow
$query3 = '{"query":"query{me{id username email}}"}'
try {
    $response3 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $query3
    if ($response3.data.me) {
        Write-Host "✅ me - نجح! المستخدم: $($response3.data.me.username)" -ForegroundColor Green
        $results["me"] = "✅ نجح"
    } else {
        Write-Host "❌ me - فشل!" -ForegroundColor Red
        $results["me"] = "❌ فشل"
    }
} catch {
    Write-Host "❌ me - خطأ: $($_.Exception.Message)" -ForegroundColor Red
    $results["me"] = "❌ خطأ"
}

# Test 4: addPost
Write-Host "`n4️⃣ اختبار addPost..." -ForegroundColor Yellow
$mutation1 = '{"query":"mutation{addPost(input:{platform:\"Twitter\",contentType:\"TWEET\",content:\"اختبار منشور!\",author:\"test_user\"}){id platform content}}"}'
try {
    $response4 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $mutation1
    if ($response4.data.addPost) {
        Write-Host "✅ addPost - نجح! ID المنشور الجديد: $($response4.data.addPost.id)" -ForegroundColor Green
        $results["addPost"] = "✅ نجح"
        $newPostId = $response4.data.addPost.id
    } else {
        Write-Host "❌ addPost - فشل!" -ForegroundColor Red
        $results["addPost"] = "❌ فشل"
    }
} catch {
    Write-Host "❌ addPost - خطأ: $($_.Exception.Message)" -ForegroundColor Red
    $results["addPost"] = "❌ خطأ"
}

# Test 5: analyticsByContent
Write-Host "`n5️⃣ اختبار analyticsByContent..." -ForegroundColor Yellow
$query4 = '{"query":"query{analyticsByContent(contentId:\"post_1\"){id platform metrics{likes impressions}}}"}'
try {
    $response5 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $query4
    if ($response5.data.analyticsByContent) {
        Write-Host "✅ analyticsByContent - نجح! عدد التحليلات: $($response5.data.analyticsByContent.Count)" -ForegroundColor Green
        $results["analyticsByContent"] = "✅ نجح"
    } else {
        Write-Host "❌ analyticsByContent - فشل!" -ForegroundColor Red
        $results["analyticsByContent"] = "❌ فشل"
    }
} catch {
    Write-Host "❌ analyticsByContent - خطأ: $($_.Exception.Message)" -ForegroundColor Red
    $results["analyticsByContent"] = "❌ خطأ"
}

# Test 6: updatePost
Write-Host "`n6️⃣ اختبار updatePost..." -ForegroundColor Yellow
$mutation2 = '{"query":"mutation{updatePost(id:\"post_1\",input:{content:\"محتوى محدث!\"}){id content}}"}'
try {
    $response6 = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $mutation2
    if ($response6.data.updatePost) {
        Write-Host "✅ updatePost - نجح! المحتوى الجديد: $($response6.data.updatePost.content)" -ForegroundColor Green
        $results["updatePost"] = "✅ نجح"
    } else {
        Write-Host "❌ updatePost - فشل!" -ForegroundColor Red
        $results["updatePost"] = "❌ فشل"
    }
} catch {
    Write-Host "❌ updatePost - خطأ: $($_.Exception.Message)" -ForegroundColor Red
    $results["updatePost"] = "❌ خطأ"
}

# Test 7: Homepage
Write-Host "`n7️⃣ اختبار الصفحة الرئيسية..." -ForegroundColor Yellow
try {
    $response7 = Invoke-RestMethod -Uri "http://localhost:4000" -Method GET
    if ($response7.message) {
        Write-Host "✅ Homepage - نجح! الرسالة: $($response7.message)" -ForegroundColor Green
        $results["homepage"] = "✅ نجح"
    } else {
        Write-Host "❌ Homepage - فشل!" -ForegroundColor Red
        $results["homepage"] = "❌ فشل"
    }
} catch {
    Write-Host "❌ Homepage - خطأ: $($_.Exception.Message)" -ForegroundColor Red
    $results["homepage"] = "❌ خطأ"
}

# عرض النتائج النهائية
Write-Host "`n🏆 ملخص النتائج:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan

$successCount = 0
$totalCount = $results.Count

foreach ($endpoint in $results.Keys) {
    $status = $results[$endpoint]
    Write-Host "• $endpoint : $status"
    if ($status -like "*نجح*") { $successCount++ }
}

Write-Host "`n📊 الإحصائيات:" -ForegroundColor Cyan
Write-Host "العمل بنجاح: $successCount/$totalCount"
Write-Host "معدل النجاح: $([math]::Round(($successCount/$totalCount)*100, 2))%"

if ($successCount -eq $totalCount) {
    Write-Host "`n🎉 جميع الـ Endpoints تعمل بدون مصادقة!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ بعض الـ Endpoints تحتاج مراجعة!" -ForegroundColor Yellow
} 