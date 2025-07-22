# اختبار سريع للسيرفر
Write-Host "🚀 اختبار السيرفر..." -ForegroundColor Green

# اختبار الصفحة الرئيسية
Write-Host "`n1️⃣ اختبار الصفحة الرئيسية..." -ForegroundColor Yellow
try {
    $homeResponse = Invoke-RestMethod -Uri "http://localhost:4000" -Method GET
    Write-Host "✅ الصفحة الرئيسية تعمل!" -ForegroundColor Green
    Write-Host "📊 Database Status: $($homeResponse.status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ خطأ في الصفحة الرئيسية: $($_.Exception.Message)" -ForegroundColor Red
}

# اختبار GraphQL - Available Models
Write-Host "`n2️⃣ اختبار GraphQL - Available Models..." -ForegroundColor Yellow
try {
    $graphqlQuery = @{
        query = "query { availableModels { success totalModels models { name description } } }"
    } | ConvertTo-Json -Depth 10

    $graphqlResponse = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $graphqlQuery -ContentType "application/json"
    
    if ($graphqlResponse.data.availableModels.success) {
        Write-Host "✅ GraphQL يعمل!" -ForegroundColor Green
        Write-Host "📋 عدد النماذج المتاحة: $($graphqlResponse.data.availableModels.totalModels)" -ForegroundColor Cyan
        $graphqlResponse.data.availableModels.models | ForEach-Object {
            Write-Host "   - $($_.name): $($_.description)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ خطأ في GraphQL: $($_.Exception.Message)" -ForegroundColor Red
}

# اختبار Generic Query
Write-Host "`n3️⃣ اختبار Generic Query..." -ForegroundColor Yellow
try {
    $genericQuery = @{
        query = "query { genericQuery(modelName: \"SocialContent\", pagination: { type: offset, limit: 5 }) { success totalCount data } }"
    } | ConvertTo-Json -Depth 10

    $genericResponse = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $genericQuery -ContentType "application/json"
    
    if ($genericResponse.data.genericQuery.success) {
        Write-Host "✅ Generic Query يعمل!" -ForegroundColor Green
        Write-Host "📊 عدد السجلات: $($genericResponse.data.genericQuery.totalCount)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ خطأ في Generic Query: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 انتهاء الاختبار!" -ForegroundColor Green
Write-Host "🌐 GraphQL Playground: http://localhost:4000/graphql" -ForegroundColor Cyan 