# Test API script for Project 2 (PowerShell)
# Run from project2 folder in a separate terminal while server runs

$base = 'http://localhost:5500'

Write-Host "GET $base/" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$base/" | ConvertTo-Json

Write-Host "GET $base/api/authors" -ForegroundColor Cyan
$authors = Invoke-RestMethod -Uri "$base/api/authors" | ConvertTo-Json
Write-Host $authors

Write-Host "Create a new author" -ForegroundColor Cyan
$newAuthor = Invoke-RestMethod -Uri "$base/api/authors" -Method Post -Headers @{ 'Content-Type' = 'application/json' } -Body '{"firstName":"Test","lastName":"Author","email":"testauthor@example.com"}'
$newAuthor | ConvertTo-Json

$authorId = $newAuthor._id
Write-Host "Created author id: $authorId" -ForegroundColor Green

Write-Host "Create book with new author id" -ForegroundColor Cyan
$body = @"
{"title":"Test Book","isbn":"1231231231231234","author":"$authorId","price":9.99}
"@
$newBook = Invoke-RestMethod -Uri "$base/api/books" -Method Post -Headers @{ 'Content-Type' = 'application/json' } -Body $body
$newBook | ConvertTo-Json

Write-Host "List books" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$base/api/books" | ConvertTo-Json

# Clean up (delete created book and author)
Write-Host "Cleanup: Delete created book and author" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$base/api/books/$($newBook._id)" -Method Delete
Invoke-RestMethod -Uri "$base/api/authors/$authorId" -Method Delete

Write-Host "Done" -ForegroundColor Green
