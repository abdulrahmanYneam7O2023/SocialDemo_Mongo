# Simple Server Test
Write-Host "Testing Enhanced Social Media API Server..." -ForegroundColor Green

# Test Homepage
Write-Host "`n1. Testing Homepage..." -ForegroundColor Yellow
try {
    $homeResponse = Invoke-RestMethod -Uri "http://localhost:4000" -Method GET
    Write-Host "✅ Homepage works!" -ForegroundColor Green
    Write-Host "Database Status: $($homeResponse.status)" -ForegroundColor Cyan
    Write-Host "Features: $($homeResponse.features.count) available" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Homepage Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test GraphQL - Available Models
Write-Host "`n2. Testing GraphQL - Available Models..." -ForegroundColor Yellow
try {
    $graphqlQuery = @{
        query = "query { availableModels { success totalModels models { name description } } }"
    } | ConvertTo-Json -Depth 10

    $graphqlResponse = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $graphqlQuery -ContentType "application/json"
    
    if ($graphqlResponse.data.availableModels.success) {
        Write-Host "✅ GraphQL works!" -ForegroundColor Green
        Write-Host "Available Models: $($graphqlResponse.data.availableModels.totalModels)" -ForegroundColor Cyan
        $graphqlResponse.data.availableModels.models | ForEach-Object {
            Write-Host "   - $($_.name): $($_.description)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ GraphQL Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Generic Query
Write-Host "`n3. Testing Generic Query..." -ForegroundColor Yellow
try {
    $genericQuery = @{
        query = "query { genericQuery(modelName: \`"SocialContent\`", pagination: { type: offset, limit: 5 }) { success totalCount data } }"
    } | ConvertTo-Json -Depth 10

    $genericResponse = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $genericQuery -ContentType "application/json"
    
    if ($genericResponse.data.genericQuery.success) {
        Write-Host "✅ Generic Query works!" -ForegroundColor Green
        Write-Host "Total Records: $($genericResponse.data.genericQuery.totalCount)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Generic Query Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Test Complete!" -ForegroundColor Green
Write-Host "🌐 GraphQL Playground: http://localhost:4000/graphql" -ForegroundColor Cyan 