# Frontend HTTPS Configuration

## Environment Variables
Create a `.env` file in the frontend directory with the following:

```bash
# HTTPS Configuration
HTTPS=true
SSL_CRT_FILE=../backend/cert.pem
SSL_KEY_FILE=../backend/key.pem

# API Configuration
REACT_APP_API_URL=https://localhost:4000/api
REACT_APP_CLIENT_URL=https://localhost:3000
```

## Package.json Scripts Update
Add HTTPS support to the start script:

```json
{
  "scripts": {
    "start": "HTTPS=true SSL_CRT_FILE=../backend/cert.pem SSL_KEY_FILE=../backend/key.pem react-scripts start",
    "start:http": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## Security Headers
The backend now includes comprehensive security headers via Helmet.js:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- HSTS (HTTP Strict Transport Security)

## File Upload Security
The backend now includes secure file upload functionality with:
- MIME type validation (JPEG, PNG, WebP only)
- File size limits (5MB maximum)
- Filename sanitization
- Secure storage outside web root
