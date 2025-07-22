# Simple Atlas Connection Test
Write-Host "🚀 Testing MongoDB Atlas Integration..." -ForegroundColor Green

# Test 1: Homepage
Write-Host "`n1. Testing Homepage..." -ForegroundColor Yellow
try {
    $homeResponse = Invoke-RestMethod -Uri "http://localhost:4000" -Method GET
    Write-Host "✅ Homepage works!" -ForegroundColor Green
    Write-Host "Database: $($homeResponse.database.name)" -ForegroundColor Cyan
    Write-Host "Connection State: $($homeResponse.database.state)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Homepage Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: GraphQL Available Models
Write-Host "`n2. Testing Available Models..." -ForegroundColor Yellow
try {
    $query = @"
    {
        "query": "query { availableModels { success totalModels models { name description } } }"
    }
"@

    $response = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $query -ContentType "application/json"
    
    if ($response.data.availableModels.success) {
        Write-Host "✅ Available Models working!" -ForegroundColor Green
        Write-Host "Total Models: $($response.data.availableModels.totalModels)" -ForegroundColor Cyan
        
        foreach ($model in $response.data.availableModels.models) {
            Write-Host "   📋 $($model.name): $($model.description)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ Available Models Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Generic Query
Write-Host "`n3. Testing Generic Query..." -ForegroundColor Yellow
try {
    $queryContent = @"
    {
        "query": "query { genericQuery(modelName: \"SocialContent\", pagination: { type: offset, limit: 2 }) { success totalCount data } }"
    }
"@

    $queryResponse = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $queryContent -ContentType "application/json"
    
    if ($queryResponse.data.genericQuery.success) {
        Write-Host "✅ Generic Query working!" -ForegroundColor Green
        Write-Host "Total Records: $($queryResponse.data.genericQuery.totalCount)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ Generic Query returned success: false" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Generic Query Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Atlas Integration Test Complete!" -ForegroundColor Green
Write-Host "🌐 Access Points:" -ForegroundColor Cyan
Write-Host "   📊 Homepage: http://localhost:4000" -ForegroundColor White
Write-Host "   🎮 GraphQL: http://localhost:4000/graphql" -ForegroundColor White 