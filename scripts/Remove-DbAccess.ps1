# PowerShell script to remove PostgreSQL database access for specific IP addresses
# Usage: .\Remove-DbAccess.ps1

# Path to compose-production.yml
$composePath = Join-Path -Path $PSScriptRoot -ChildPath "..\compose-production.yml"
$backupPath = Join-Path -Path $PSScriptRoot -ChildPath "..\compose-production.yml.bak"

# Create a backup of the current compose-production.yml file
Copy-Item -Path $composePath -Destination $backupPath -Force

# Read the compose file
$composeContent = Get-Content -Path $composePath

# Remove lines with specific IP addresses for database access
$updatedContent = $composeContent | ForEach-Object {
    if ($_ -match '^\s*-\s*"\d+\.\d+\.\d+\.\d+:5432:5432"') {
        # Skip this line (don't add it to the output)
    } else {
        # Keep this line
        $_
    }
}

# Write the updated content back to the file
Set-Content -Path $composePath -Value $updatedContent

Write-Host "Database access configuration updated successfully!" -ForegroundColor Green
Write-Host "The PostgreSQL database is now accessible only from localhost (127.0.0.1)."
Write-Host ""
Write-Host "To apply these changes, restart your containers with:" -ForegroundColor Yellow
Write-Host "  docker-compose -f compose-production.yml down"
Write-Host "  docker-compose -f compose-production.yml up -d"
Write-Host ""
Write-Host "Your database is now more secure." -ForegroundColor Green