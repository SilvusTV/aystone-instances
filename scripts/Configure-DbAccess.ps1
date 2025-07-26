# PowerShell script to configure PostgreSQL database access for specific IP addresses
# Usage: .\Configure-DbAccess.ps1 -IpAddress <your_ip_address>

param (
    [Parameter(Mandatory=$true, HelpMessage="Enter your IP address")]
    [string]$IpAddress
)

# Validate IP address format
if (-not ($IpAddress -match "^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")) {
    Write-Error "Invalid IP address format. Please provide a valid IPv4 address (e.g., 192.168.1.100)"
    exit 1
}

# Path to compose-production.yml
$composePath = Join-Path -Path $PSScriptRoot -ChildPath "..\compose-production.yml"
$backupPath = Join-Path -Path $PSScriptRoot -ChildPath "..\compose-production.yml.bak"

# Create a backup of the original compose-production.yml file
Copy-Item -Path $composePath -Destination $backupPath -Force

# Read the compose file
$composeContent = Get-Content -Path $composePath -Raw

# Update the ports configuration
$pattern = '- "127.0.0.1:5432:5432"'
$replacement = "- `"127.0.0.1:5432:5432`"`n      - `"$IpAddress`:5432:5432`""
$updatedContent = $composeContent -replace $pattern, $replacement

# Write the updated content back to the file
Set-Content -Path $composePath -Value $updatedContent

Write-Host "Database access configuration updated successfully!" -ForegroundColor Green
Write-Host "The PostgreSQL database is now accessible from:"
Write-Host "  - localhost (127.0.0.1)"
Write-Host "  - Your IP address ($IpAddress)"
Write-Host ""
Write-Host "To apply these changes, restart your containers with:" -ForegroundColor Yellow
Write-Host "  docker-compose -f compose-production.yml down"
Write-Host "  docker-compose -f compose-production.yml up -d"
Write-Host ""
Write-Host "For security reasons, remember to remove this access when it's no longer needed." -ForegroundColor Red