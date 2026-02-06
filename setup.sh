#!/bin/bash

# Quick Start Script for Pothole Segmentation App with Supabase

echo "🚀 Pothole Segmentation - Supabase Integration Setup"
echo "=================================================="
echo ""

# Check if .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo "❌ frontend/.env.local not found!"
    echo ""
    echo "Create it with your Supabase credentials:"
    echo ""
    echo "VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "VITE_SUPABASE_ANON_KEY=your_anon_key"
    echo "VITE_GEMINI_API_KEY=your_gemini_key"
    echo "VITE_API_URL=http://localhost:8000"
    echo ""
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create Supabase project at https://supabase.com"
echo "2. Run SQL from SUPABASE_SETUP.md in SQL Editor"
echo "3. Create storage buckets: reports, proofs, avatars"
echo "4. Update .env.local with your credentials"
echo ""
echo "To start the app:"
echo "  Frontend: cd frontend && npm run dev"
echo "  Backend:  cd backend && uvicorn backend.app.main:app --reload"
echo ""
echo "🎉 Ready to go!"
