#!/bin/bash

# Central Pet Care Management System - Security Setup Script
# This script sets up SSL/TLS certificates and installs required dependencies

echo "🔒 Setting up Central Pet Care Management System Security Features..."

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert is not installed. Please install it first:"
    echo "   Windows: choco install mkcert"
    echo "   macOS: brew install mkcert"
    echo "   Linux: sudo apt install mkcert"
    exit 1
fi

echo "✅ mkcert is installed"

# Navigate to backend directory
cd backend

# Install local CA
echo "🔐 Installing local Certificate Authority..."
mkcert -install

# Generate SSL certificates
echo "📜 Generating SSL certificates for localhost..."
mkcert -cert-file ./cert.pem -key-file ./key.pem localhost 127.0.0.1 ::1

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Navigate to frontend directory
cd ../frontend

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create .env file for frontend
echo "⚙️ Creating frontend environment configuration..."
cat > .env << EOF
HTTPS=true
SSL_CRT_FILE=../backend/cert.pem
SSL_KEY_FILE=../backend/key.pem
REACT_APP_API_URL=https://localhost:4000/api
REACT_APP_CLIENT_URL=https://localhost:3000
EOF

# Navigate back to project root
cd ..

echo ""
echo "🎉 Security setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy env.example to .env in backend directory and configure your settings"
echo "2. Start the backend server: cd backend && npm run dev"
echo "3. Start the frontend server: cd frontend && npm start"
echo ""
echo "🔒 Security features implemented:"
echo "   ✅ SSL/TLS encryption"
echo "   ✅ Secure file uploads"
echo "   ✅ Security headers (Helmet.js)"
echo "   ✅ CORS protection"
echo "   ✅ X-Powered-By header removal"
echo ""
echo "🌐 Your application will be available at:"
echo "   Frontend: https://localhost:3000"
echo "   Backend: https://localhost:4000"
