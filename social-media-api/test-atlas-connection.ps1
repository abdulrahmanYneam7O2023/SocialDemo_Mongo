# Test MongoDB Atlas Connection & Data Operations
Write-Host "🚀 Testing Enhanced Social Media API with MongoDB Atlas..." -ForegroundColor Green

# Test Homepage with Database Status
Write-Host "`n1. Testing Homepage & Database Status..." -ForegroundColor Yellow
try {
    $homeResponse = Invoke-RestMethod -Uri "http://localhost:4000" -Method GET
    Write-Host "✅ Homepage works!" -ForegroundColor Green
    Write-Host "Database Status: $($homeResponse.status)" -ForegroundColor Cyan
    Write-Host "Database Name: $($homeResponse.database.name)" -ForegroundColor Cyan
    Write-Host "Connection State: $($homeResponse.database.state)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Homepage Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test GraphQL Schema Introspection
Write-Host "`n2. Testing GraphQL Schema..." -ForegroundColor Yellow
try {
    $schemaQuery = @{
        query = "query { __schema { types { name } } }"
    } | ConvertTo-Json -Depth 10

    $schemaResponse = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $schemaQuery -ContentType "application/json"
    
    if ($schemaResponse.data.__schema) {
        Write-Host "✅ GraphQL Schema loaded successfully!" -ForegroundColor Green
        $typeCount = $schemaResponse.data.__schema.types.Count
        Write-Host "Schema Types Count: $typeCount" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ GraphQL Schema Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Available Models (our enhanced feature)
Write-Host "`n3. Testing Available Models..." -ForegroundColor Yellow
try {
    $modelsQuery = @{
        query = "query { availableModels { success totalModels models { name description searchableFields } } }"
    } | ConvertTo-Json -Depth 10

    $modelsResponse = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $modelsQuery -ContentType "application/json"
    
    if ($modelsResponse.data.availableModels.success) {
        Write-Host "✅ Available Models working!" -ForegroundColor Green
        Write-Host "Total Models: $($modelsResponse.data.availableModels.totalModels)" -ForegroundColor Cyan
        
        $modelsResponse.data.availableModels.models | ForEach-Object {
            Write-Host "   📋 Model: $($_.name) - $($_.description)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ Available Models Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Generic Query with SocialContent
Write-Host "`n4. Testing Generic Query (SocialContent)..." -ForegroundColor Yellow
try {
    $genericQuery = @{
        query = "query { genericQuery(modelName: \`"SocialContent\`", pagination: { type: offset, limit: 3 }) { success totalCount data pageInfo { hasNextPage hasPreviousPage } } }"
    } | ConvertTo-Json -Depth 10

    $queryResponse = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $genericQuery -ContentType "application/json"
    
    if ($queryResponse.data.genericQuery.success) {
        Write-Host "✅ Generic Query working!" -ForegroundColor Green
        Write-Host "Total SocialContent Records: $($queryResponse.data.genericQuery.totalCount)" -ForegroundColor Cyan
        Write-Host "Has Next Page: $($queryResponse.data.genericQuery.pageInfo.hasNextPage)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Generic Query Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Create Mutation
Write-Host "`n5. Testing Generic Mutation (CREATE)..." -ForegroundColor Yellow
try {
    $testData = @{
        contentType = "post"
        platform = "Instagram"
        content = @{
            caption = "Test post from API"
            hashtags = @("#test", "#api")
        }
        publishStatus = "draft"
    } | ConvertTo-Json -Depth 10 -Compress
    
    $createQuery = @{
        query = "mutation { genericMutation(modelName: \`"SocialContent\`", operation: CREATE, data: \`"$testData\`") { success message data } }"
    } | ConvertTo-Json -Depth 10

    $createResponse = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method POST -Body $createQuery -ContentType "application/json"
    
    if ($createResponse.data.genericMutation.success) {
        Write-Host "✅ Generic Mutation (CREATE) working!" -ForegroundColor Green
        Write-Host "Message: $($createResponse.data.genericMutation.message)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Generic Mutation Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Atlas Connection Test Complete!" -ForegroundColor Green
Write-Host "🌐 GraphQL Playground: http://localhost:4000/graphql" -ForegroundColor Cyan
Write-Host "📊 API Homepage: http://localhost:4000" -ForegroundColor Cyan 