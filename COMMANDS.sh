#!/bin/bash
# Biz-Flow-Finance - Command Reference Guide
# Copy & paste these commands to get started

# ============================================================================
# INSTALLATION (Run Once)
# ============================================================================

# Install all dependencies (frontend & backend)
npm install && npm install --prefix server

# ============================================================================
# ENVIRONMENT SETUP
# ============================================================================

# Create backend environment file with your Supabase credentials
cat > server/.env << 'EOF'
PORT=3001
SUPABASE_URL=https://sjqcfgleswintrjzrhnj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
EOF

# Get your service role key from:
# Supabase Dashboard → Settings → API Keys → Service Role Secret

# ============================================================================
# DEVELOPMENT COMMANDS (Main)
# ============================================================================

# Run frontend + backend together (RECOMMENDED)
npm run dev:all

# Run only frontend (port 8080)
npm run dev
# OR
npm run dev:client

# Run only backend (port 3001)
npm run dev:server
# OR
cd server && npm run dev

# ============================================================================
# DATABASE SETUP
# ============================================================================

# View the SQL schema to create tables
cat DATABASE_SETUP.md

# Create tables in Supabase:
# 1. Go to https://app.supabase.com
# 2. Select your project
# 3. Go to SQL Editor
# 4. Create new query
# 5. Copy SQL from DATABASE_SETUP.md
# 6. Run the query

# Update TypeScript types (after creating tables)
npx supabase gen types typescript --project-id sjqcfgleswintrjzrhnj > src/integrations/supabase/types.ts

# ============================================================================
# BUILD COMMANDS (Production)
# ============================================================================

# Build frontend for production
npm run build

# Build backend for production
npm run build --prefix server

# Test production build locally
npm run preview

# Start production backend
npm start --prefix server

# ============================================================================
# TESTING & DEBUGGING
# ============================================================================

# Check if backend is running
curl http://localhost:3001/health

# Get all clients from API
curl http://localhost:3001/api/clients

# Get dashboard stats
curl http://localhost:3001/api/stats

# Get all invoices
curl http://localhost:3001/api/invoices

# Create a test client (POST)
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "test@example.com",
    "phone": "555-1234"
  }'

# ============================================================================
# LINTING & VALIDATION
# ============================================================================

# Run ESLint
npm run lint

# ============================================================================
# CLEANUP & REINSTALL
# ============================================================================

# Remove node_modules and reinstall (if something is broken)
rm -rf node_modules && rm -rf server/node_modules && npm install && npm install --prefix server

# Clear npm cache
npm cache clean --force

# ============================================================================
# DOCUMENTATION COMMANDS
# ============================================================================

# View all documentation
ls -la *.md

# Read quick start guide
cat QUICK_START.md

# Read project summary
cat PROJECT_SUMMARY.md

# Read database setup
cat DATABASE_SETUP.md

# Read implementation tasks
cat IMPLEMENTATION_CHECKLIST.md

# Read system architecture
cat ARCHITECTURE.md

# ============================================================================
# USEFUL ALIASES (Optional - Add to ~/.zshrc or ~/.bashrc)
# ============================================================================

# Add these to your shell config:
alias biz-dev="npm run dev:all"
alias biz-client="npm run dev:client"
alias biz-server="npm run dev:server"
alias biz-build="npm run build && npm run build --prefix server"
alias biz-health="curl http://localhost:3001/health"

# Then use:
# biz-dev        # Run everything
# biz-client     # Frontend only
# biz-server     # Backend only
# biz-health     # Check API

# ============================================================================
# DEPLOYMENT PREPARATION
# ============================================================================

# Build for deployment
npm run build
npm run build --prefix server

# Verify builds work
npm run preview

# Check file sizes
du -h dist/
du -h server/dist/

# ============================================================================
# DEBUGGING
# ============================================================================

# View backend logs while running
npm run dev:server  # Output shows all requests

# View frontend errors in browser console
# Open http://localhost:8080
# Press F12 for Developer Tools
# Click "Console" tab

# Check TypeScript errors
npx tsc --noEmit

# Check backend TypeScript
npx tsc --noEmit --project server/tsconfig.json

# ============================================================================
# PACKAGE MANAGEMENT
# ============================================================================

# Add a new dependency to frontend
npm install package-name

# Add dev dependency to frontend
npm install -D package-name

# Add dependency to backend
npm install --prefix server package-name

# Add dev dependency to backend
npm install -D --prefix server package-name

# Update all dependencies (risky!)
npm update && npm update --prefix server

# Check for outdated packages
npm outdated
npm outdated --prefix server

# ============================================================================
# GIT COMMANDS (If using version control)
# ============================================================================

# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to remote
git push origin main

# ============================================================================
# PRODUCTION DEPLOYMENT EXAMPLES
# ============================================================================

# Frontend deployment (Vercel)
# 1. Install Vercel CLI: npm i -g vercel
# 2. Run: vercel
# 3. Follow prompts

# Backend deployment (Render)
# 1. Push code to GitHub
# 2. Go to https://render.com
# 3. Create new Web Service
# 4. Connect GitHub repo
# 5. Set start command: npm start --prefix server
# 6. Add environment variables

# Database
# Already hosted on Supabase - nothing to deploy!

# ============================================================================
# ENVIRONMENT VARIABLES
# ============================================================================

# Frontend needs (check .env.example):
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
# REACT_APP_API_URL=http://localhost:3001

# Backend needs (in server/.env):
# PORT=3001
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ============================================================================
# FILE & DIRECTORY STRUCTURE
# ============================================================================

# View project structure
find . -type f -name "*.md" | sort
find . -type d -name "node_modules" -prune -o -type f -print | head -20

# Check file sizes
du -sh src/
du -sh server/src/
du -sh node_modules/
du -sh server/node_modules/

# ============================================================================
# QUICK DIAGNOSTICS
# ============================================================================

# Full system check script (copy & run)
echo "=== Biz-Flow-Finance Diagnostics ===" && \
echo "Node version:" && node -v && \
echo "npm version:" && npm -v && \
echo "Frontend dependencies:" && ls src/lib/api.ts && \
echo "Backend running:" && timeout 2 npm run dev:server &>/dev/null && echo "✅ Can start" || echo "❌ Check error" && \
echo "=== End Diagnostics ===" 

# ============================================================================
# QUICK START SCRIPT (Copy & Run)
# ============================================================================

# Quick start from scratch
# Copy this entire block and paste into terminal:

#!/bin/bash
cd /Users/prateekkumar/Desktop/Biz-Flow-Finance

# Install
echo "📦 Installing dependencies..."
npm install && npm install --prefix server

# Configure
echo "⚙️  Creating environment..."
cat > server/.env << 'EOF'
PORT=3001
SUPABASE_URL=https://sjqcfgleswintrjzrhnj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=PASTE-YOUR-KEY-HERE
EOF

# Run
echo "🚀 Starting development servers..."
npm run dev:all

# This will output:
# [client] ✓ Frontend running at http://localhost:8080
# [server] API server listening on http://localhost:3001

# ============================================================================
# END OF COMMANDS
# ============================================================================

# For more help:
# - Read: 00_START_HERE.md
# - Read: QUICK_START.md
# - Read: IMPLEMENTATION_CHECKLIST.md
