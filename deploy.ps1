# PRN Creative Platform - Deployment Script for Windows
# Usage: .\deploy.ps1 [netlify|vercel|manual]

param(
    [string]$Target = "netlify"
)

Write-Host "🚀 PRN Creative Platform Deployment" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "📦 Building project..." -ForegroundColor Yellow
    npm run build
}

Write-Host "✅ Build complete: dist/ folder ready" -ForegroundColor Green

switch ($Target) {
    "netlify" {
        Write-Host "🌐 Deploying to Netlify..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "OPTION 1: Drag & drop 'dist' folder to:" -ForegroundColor Yellow
        Write-Host "   https://app.netlify.com/drop" -ForegroundColor White
        Write-Host ""
        Write-Host "OPTION 2: Use Netlify CLI:" -ForegroundColor Yellow
        Write-Host "   npm install -g netlify-cli" -ForegroundColor White
        Write-Host "   netlify login" -ForegroundColor White
        Write-Host "   netlify deploy --prod --dir=dist" -ForegroundColor White
        Write-Host ""
        Write-Host "OPTION 3: Connect Git repository:" -ForegroundColor Yellow
        Write-Host "   1. Push to GitHub/GitLab" -ForegroundColor White
        Write-Host "   2. Go to https://app.netlify.com" -ForegroundColor White
        Write-Host "   3. 'Add new site' → 'Import from Git'" -ForegroundColor White
        Write-Host "   4. Build command: npm run build" -ForegroundColor White
        Write-Host "   5. Publish directory: dist" -ForegroundColor White
        break
    }
    
    "vercel" {
        Write-Host "▲ Deploying to Vercel..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Install Vercel CLI:" -ForegroundColor Yellow
        Write-Host "   npm i -g vercel" -ForegroundColor White
        Write-Host "   vercel" -ForegroundColor White
        Write-Host ""
        Write-Host "Or push to GitHub and import at:" -ForegroundColor Yellow
        Write-Host "   https://vercel.com/new" -ForegroundColor White
        break
    }
    
    "manual" {
        Write-Host "📁 Manual deployment options:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Netlify: Drag 'dist' to https://app.netlify.com/drop" -ForegroundColor White
        Write-Host "2. Vercel: Install CLI or use web interface" -ForegroundColor White
        Write-Host "3. GitHub Pages: Requires base path configuration" -ForegroundColor White
        Write-Host "4. Cloudflare Pages: Connect Git repository" -ForegroundColor White
        Write-Host "5. AWS S3: Upload 'dist' folder to S3 bucket" -ForegroundColor White
        Write-Host ""
        Write-Host "Configuration files included:" -ForegroundColor Yellow
        Write-Host "   - netlify.toml (Netlify config)" -ForegroundColor White
        Write-Host "   - README.md (Full instructions)" -ForegroundColor White
        break
    }
    
    default {
        Write-Host "Usage: .\deploy.ps1 [netlify|vercel|manual]" -ForegroundColor Red
        Write-Host "Default: netlify" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "📋 Post-deployment checklist:" -ForegroundColor Cyan
Write-Host "   1. Test all routes (SPA routing should work)" -ForegroundColor White
Write-Host "   2. Test editor functionality" -ForegroundColor White
Write-Host "   3. Test export features" -ForegroundColor White
Write-Host "   4. Check mobile responsiveness" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Your PRN platform will be live in seconds!" -ForegroundColor Green