# Enhanced Social Media API Testing Script
Write-Host "🧪 اختبار شامل للنظام المحسن..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:4000"
$graphqlUrl = "$baseUrl/graphql"
$headers = @{"Content-Type" = "application/json"}
$results = @{}

# Test 1: Homepage
Write-Host "`n🏠 1. اختبار الصفحة الرئيسية..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method GET
    if ($response.message) {
        Write-Host "✅ Homepage - SUCCESS!" -ForegroundColor Green
        Write-Host "📊 Database: $($response.database.database) ($($response.database.state))" -ForegroundColor Cyan
        Write-Host "🔧 Features: $($response.features.Count) available" -ForegroundColor Cyan
        $results["homepage"] = "SUCCESS"
    }
} catch {
    Write-Host "❌ Homepage - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $results["homepage"] = "ERROR"
}

# Test 2: Available Models
Write-Host "`n📋 2. اختبار قائمة النماذج المتاحة..." -ForegroundColor Yellow
$query2 = '{"query":"query{availableModels{success models{name description searchableFields filterableFields}}}"}'
try {
    $response2 = Invoke-RestMethod -Uri $graphqlUrl -Method POST -Headers $headers -Body $query2
    if ($response2.data.availableModels.success) {
        Write-Host "✅ availableModels - SUCCESS!" -ForegroundColor Green
        Write-Host "📋 Models available: $($response2.data.availableModels.models.Count)" -ForegroundColor Cyan
        foreach ($model in $response2.data.availableModels.models) {
            Write-Host "  • $($model.name): $($model.description)" -ForegroundColor Gray
        }
        $results["availableModels"] = "SUCCESS"
    }
} catch {
    Write-Host "❌ availableModels - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $results["availableModels"] = "ERROR"
}

# Test 3: Generic Query - SocialContent
Write-Host "`n🔍 3. اختبار genericQuery للمحتوى..." -ForegroundColor Yellow
$query3 = @"
{
  "query": "query {
    genericQuery(
      modelName: \"SocialContent\"
      filter: [
        { field: \"publishStatus\", operator: eq, value: \"PUBLISHED\" }
      ]
      sort: [
        { field: \"createdAt\", direction: desc }
      ]
      pagination: {
        type: offset
        limit: 5
        offset: 0
      }
    ) {
      success
      totalCount
      pageInfo {
        hasNextPage
        totalPages
        currentPage
      }
    }
  }"
}
"@

try {
    $response3 = Invoke-RestMethod -Uri $graphqlUrl -Method POST -Headers $headers -Body $query3
    if ($response3.data.genericQuery.success) {
        Write-Host "✅ genericQuery (SocialContent) - SUCCESS!" -ForegroundColor Green
        Write-Host "📊 Total Count: $($response3.data.genericQuery.totalCount)" -ForegroundColor Cyan
        Write-Host "📄 Pages: $($response3.data.genericQuery.pageInfo.totalPages)" -ForegroundColor Cyan
        $results["genericQuery"] = "SUCCESS"
    }
} catch {
    Write-Host "❌ genericQuery - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $results["genericQuery"] = "ERROR"
}

# Test 4: Generic Mutation - CREATE SocialContent
Write-Host "`n➕ 4. اختبار genericMutation - CREATE..." -ForegroundColor Yellow
$mutation4 = @"
{
  "query": "mutation {
    genericMutation(
      modelName: \"SocialContent\"
      operation: CREATE
      data: \"{\\\"platform\\\":\\\"INSTAGRAM\\\",\\\"contentType\\\":\\\"IMAGE\\\",\\\"content\\\":\\\"اختبار المحتوى الجديد! 📱✨\\\",\\\"author\\\":\\\"test_user\\\",\\\"publishStatus\\\":\\\"DRAFT\\\"}\"
    ) {
      success
      message
    }
  }"
}
"@

try {
    $response4 = Invoke-RestMethod -Uri $graphqlUrl -Method POST -Headers $headers -Body $mutation4
    if ($response4.data.genericMutation.success) {
        Write-Host "✅ genericMutation (CREATE) - SUCCESS!" -ForegroundColor Green
        Write-Host "💬 Message: $($response4.data.genericMutation.message)" -ForegroundColor Cyan
        $results["genericMutation_CREATE"] = "SUCCESS"
    }
} catch {
    Write-Host "❌ genericMutation CREATE - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $results["genericMutation_CREATE"] = "ERROR"
}

# Test 5: Social Content Creation (Specialized)
Write-Host "`n📱 5. اختبار createSocialContent المخصص..." -ForegroundColor Yellow
$mutation5 = @"
{
  "query": "mutation {
    createSocialContent(
      input: {
        platform: TWITTER
        contentType: TWEET
        content: \"تجربة النظام المحسن! 🚀 #SocialMediaAPI #GraphQL\"
        author: \"enhanced_user\"
        hashtags: [\"test\", \"enhanced\", \"api\"]
        settings: {
          commentsEnabled: true
        }
      }
    ) {
      success
      message
    }
  }"
}
"@

try {
    $response5 = Invoke-RestMethod -Uri $graphqlUrl -Method POST -Headers $headers -Body $mutation5
    if ($response5.data.createSocialContent.success) {
        Write-Host "✅ createSocialContent - SUCCESS!" -ForegroundColor Green
        Write-Host "💬 Message: $($response5.data.createSocialContent.message)" -ForegroundColor Cyan
        $results["createSocialContent"] = "SUCCESS"
    }
} catch {
    Write-Host "❌ createSocialContent - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $results["createSocialContent"] = "ERROR"
}

# Test 6: Search with genericQuery
Write-Host "`n🔎 6. اختبار البحث باستخدام genericQuery..." -ForegroundColor Yellow
$query6 = @"
{
  "query": "query {
    genericQuery(
      modelName: \"SocialContent\"
      searchTerm: \"تجربة\"
      pagination: {
        type: offset
        limit: 3
        offset: 0
      }
    ) {
      success
      totalCount
    }
  }"
}
"@

try {
    $response6 = Invoke-RestMethod -Uri $graphqlUrl -Method POST -Headers $headers -Body $query6
    if ($response6.data.genericQuery.success) {
        Write-Host "✅ Search with genericQuery - SUCCESS!" -ForegroundColor Green
        Write-Host "🔍 Search results: $($response6.data.genericQuery.totalCount)" -ForegroundColor Cyan
        $results["search"] = "SUCCESS"
    }
} catch {
    Write-Host "❌ Search - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $results["search"] = "ERROR"
}

# Test 7: Test BULK operations
Write-Host "`n📦 7. اختبار العمليات المجمعة..." -ForegroundColor Yellow
$mutation7 = @"
{
  "query": "mutation {
    genericMutation(
      modelName: \"SocialContent\"
      operation: BULK_UPDATE
      filter: [
        { field: \"author\", operator: eq, value: \"test_user\" }
      ]
      data: \"{\\\"publishStatus\\\":\\\"PUBLISHED\\\"}\"
    ) {
      success
      message
    }
  }"
}
"@

try {
    $response7 = Invoke-RestMethod -Uri $graphqlUrl -Method POST -Headers $headers -Body $mutation7
    if ($response7.data.genericMutation.success) {
        Write-Host "✅ Bulk Operations - SUCCESS!" -ForegroundColor Green
        Write-Host "💬 Message: $($response7.data.genericMutation.message)" -ForegroundColor Cyan
        $results["bulk_operations"] = "SUCCESS"
    }
} catch {
    Write-Host "❌ Bulk Operations - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $results["bulk_operations"] = "ERROR"
}

# Summary
Write-Host "`n🏆 ملخص النتائج النهائية:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$successCount = 0
$totalCount = $results.Count

foreach ($test in $results.Keys) {
    $status = $results[$test]
    $icon = if ($status -eq "SUCCESS") { "✅" } else { "❌" }
    Write-Host "$icon $test : $status"
    if ($status -eq "SUCCESS") { $successCount++ }
}

Write-Host "`n📊 الإحصائيات النهائية:" -ForegroundColor Cyan
Write-Host "النجح: $successCount/$totalCount"
Write-Host "معدل النجاح: $([math]::Round(($successCount/$totalCount)*100, 2))%"

if ($successCount -eq $totalCount) {
    Write-Host "`n🎉 النظام المحسن يعمل بكامل طاقته!" -ForegroundColor Green
    Write-Host "✨ جميع الميزات الجديدة تعمل بنجاح!" -ForegroundColor Green
    Write-Host "🚀 جاهز للاستخدام الإنتاجي!" -ForegroundColor Green
} elseif ($successCount -gt ($totalCount * 0.7)) {
    Write-Host "`n⚠️ النظام يعمل بشكل جيد مع بعض المشاكل البسيطة" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ هناك مشاكل تحتاج مراجعة" -ForegroundColor Red
}

Write-Host "`n🔧 الميزات المتاحة:" -ForegroundColor Cyan
Write-Host "• genericQuery - استعلام موحد لجميع النماذج"
Write-Host "• genericMutation - عمليات موحدة (CRUD + أكثر)"
Write-Host "• createSocialContent - إنشاء محتوى سوشيال ميديا"
Write-Host "• scheduleContent - جدولة المحتوى"
Write-Host "• updateContentMetrics - تحديث الإحصائيات"
Write-Host "• Bulk Operations - عمليات مجمعة"
Write-Host "• Search - البحث النصي"
Write-Host "• Archive/Unarchive - أرشفة السجلات"

Write-Host "`n📱 المنصات المدعومة:" -ForegroundColor Cyan
Write-Host "Instagram • Facebook • Twitter • LinkedIn • TikTok • YouTube" 