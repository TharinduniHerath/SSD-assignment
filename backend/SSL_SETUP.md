# SSL/TLS Configuration for Central Pet Care Management System

## Prerequisites
Before implementing SSL/TLS, ensure you have mkcert installed:

### Windows (using Chocolatey):
```bash
choco install mkcert
```

### macOS (using Homebrew):
```bash
brew install mkcert
```

### Linux:
```bash
# Ubuntu/Debian
sudo apt install mkcert

# Or download from GitHub releases
```

## Setup Instructions

### Step 1: Install Local CA
```bash
mkcert -install
```

### Step 2: Generate SSL Certificates
```bash
# Navigate to backend directory
cd backend

# Generate certificates for localhost
mkcert -cert-file ./cert.pem -key-file ./key.pem localhost 127.0.0.1 ::1
```

### Step 3: Configure Environment Variables
Create or update `.env` file in backend directory:
```bash
# SSL Configuration
SSL_CERT_PATH=./cert.pem
SSL_KEY_PATH=./key.pem
HTTPS_PORT=4000
```

## Security Benefits
- Encrypted data transmission
- Protection against man-in-the-middle attacks
- Secure authentication token transmission
- Compliance with security best practices

## Production Considerations
- Use proper SSL certificates from trusted CA
- Implement certificate rotation
- Monitor certificate expiration
- Use strong cipher suites
