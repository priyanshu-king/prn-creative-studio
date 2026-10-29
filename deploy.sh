#!/bin/bash

# PRN Creative Platform - Deployment Script
# Usage: ./deploy.sh [netlify|vercel|manual]

set -e

echo "🚀 PRN Creative Platform Deployment"
echo "==================================="

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "📦 Building project..."
    npm run build
fi

echo "✅ Build complete: dist/ folder ready"

case "${1:-netlify}" in
    netlify)
        echo "🌐 Deploying to Netlify..."
        echo ""
        echo "OPTION 1: Drag & drop 'dist' folder to:"
        echo "   https://app.netlify.com/drop"
        echo ""
        echo "OPTION 2: Use Netlify CLI:"
        echo "   npm install -g netlify-cli"
        echo "   netlify login"
        echo "   netlify deploy --prod --dir=dist"
        echo ""
        echo "OPTION 3: Connect Git repository:"
        echo "   1. Push to GitHub/GitLab"
        echo "   2. Go to https://app.netlify.com"
        echo "   3. 'Add new site' → 'Import from Git'"
        echo "   4. Build command: npm run build"
        echo "   5. Publish directory: dist"
        ;;
    
    vercel)
        echo "▲ Deploying to Vercel..."
        echo ""
        echo "Install Vercel CLI:"
        echo "   npm i -g vercel"
        echo "   vercel"
        echo ""
        echo "Or push to GitHub and import at:"
        echo "   https://vercel.com/new"
        ;;
    
    manual)
        echo "📁 Manual deployment options:"
        echo ""
        echo "1. Netlify: Drag 'dist' to https://app.netlify.com/drop"
        echo "2. Vercel: Install CLI or use web interface"
        echo "3. GitHub Pages: Requires base path configuration"
        echo "4. Cloudflare Pages: Connect Git repository"
        echo "5. AWS S3: Upload 'dist' folder to S3 bucket"
        echo ""
        echo "Configuration files included:"
        echo "   - netlify.toml (Netlify config)"
        echo "   - README.md (Full instructions)"
        ;;
    
    *)
        echo "Usage: $0 [netlify|vercel|manual]"
        echo "Default: netlify"
        exit 1
        ;;
esac

echo ""
echo "📋 Post-deployment checklist:"
echo "   1. Test all routes (SPA routing should work)"
echo "   2. Test editor functionality"
echo "   3. Test export features"
echo "   4. Check mobile responsiveness"
echo ""
echo "🔗 Your PRN platform will be live in seconds!"