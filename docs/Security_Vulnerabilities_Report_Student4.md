# Security Vulnerabilities Report - Student 4

**Student ID**: IT18149890  
**Student Name**: Dhanushikan Vishnumoorthy  
**Course**: SE4030 – Secure Software Development  
**Assignment**: Group Security Analysis Report  

## Table of Contents
1. [Introduction](#introduction)
2. [Assigned Vulnerabilities](#assigned-vulnerabilities)
3. [Vulnerability 10 - SSL/TLS Not Implemented](#vulnerability-10---ssltls-not-implemented)
4. [Vulnerability 11 - Insecure File Uploads](#vulnerability-11---insecure-file-uploads)
5. [Vulnerability 12 - Server Leaks Information via "X-Powered-By"](#vulnerability-12---server-leaks-information-via-x-powered-by)
6. [Implementation Details](#implementation-details)
7. [Best Practices](#best-practices)
8. [Conclusion](#conclusion)

---

## Introduction

This report documents the security analysis and remediation of three critical vulnerabilities assigned to me in the Central Pet Care Management System. The vulnerabilities identified and fixed are:

1. **SSL/TLS Not Implemented Vulnerability**
2. **Insecure File Uploads Vulnerability** 
3. **Server Leaks Information via "X-Powered-By" Header**

These vulnerabilities were identified through comprehensive security testing using OWASP ZAP (Dynamic Application Security Testing) and Static Code Analysis tools. Each vulnerability represents a significant security risk that could compromise the confidentiality, integrity, and availability of the application and its users' data.

---

## Assigned Vulnerabilities

### Vulnerability Distribution
- **Vulnerability 10**: SSL/TLS not implemented vulnerability
- **Vulnerability 11**: Insecure File Uploads Vulnerability
- **Vulnerability 12**: Server Leaks Information via "X-Powered-By" Header

### Security Impact Assessment
| Vulnerability | Risk Level | Impact | Exploitability |
|---------------|------------|---------|----------------|
| SSL/TLS Missing | High | Data Interception, MITM | High |
| Insecure File Uploads | High | RCE, DoS, Data Breach | Medium |
| X-Powered-By Leak | Medium | Reconnaissance, Targeted Attacks | Low |

---

## Vulnerability 10 - SSL/TLS Not Implemented

### 4.10.1 Identified Issues

The "SSL/TLS not implemented" vulnerability occurs when a web application operates without proper SSL (Secure Sockets Layer) or TLS (Transport Layer Security) encryption for data transmission between client and server. This creates significant security risks:

#### **Issue 1: Data Interception**
- **Problem**: Users' sensitive data such as login credentials, passwords, personal information, and payment details can be intercepted during transmission by attackers
- **Risk**: High risk to users' privacy and identity theft
- **Impact**: Unencrypted data transmission exposes all user communications to potential eavesdropping

#### **Issue 2: Man-in-the-Middle (MITM) Attacks**
- **Problem**: Attackers can observe and easily modify messages before passing them between client and server
- **Risk**: Data integrity compromise and potential data manipulation
- **Impact**: Attackers can inject malicious content or steal sensitive information during transmission

### 4.10.2 How is the vulnerability fixed?

#### **Solution: Using mkcert for Local SSL/TLS Implementation**

To address the SSL/TLS implementation vulnerability in the local development environment, I implemented a comprehensive solution using mkcert, a tool designed to generate locally trusted SSL certificates without requiring commercial Certificate Authority (CA) services.

#### **Implementation Steps:**

##### **Step 1: Install mkcert**
```bash
# Install mkcert using Chocolatey (Windows package manager)
choco install mkcert
```

##### **Step 2: Set Up Local Certificate Authority**
```bash
# Create a local CA that will be trusted by the system and browsers
mkcert -install
```

##### **Step 3: Generate SSL Certificates**
```bash
# Generate SSL certificates for localhost development
mkcert -cert-file ./cert.pem -key-file ./key.pem localhost
```

##### **Step 4: Configure React for HTTPS**
```javascript
// Environment configuration for React development server
HTTPS=true
SSL_CRT_FILE=./cert.pem
SSL_KEY_FILE=./key.pem
```

#### **Technical Implementation:**

```javascript
// server.js - HTTPS Configuration
const https = require('https');
const fs = require('fs');

// Load SSL certificates
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

// Create HTTPS server
const server = https.createServer(options, app);

server.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 HTTPS Server started on port ${process.env.PORT || 4000}`);
});
```

#### **Security Benefits:**
- **Encrypted Communication**: All data transmission is encrypted using TLS
- **Authentication**: Server identity is verified through SSL certificates
- **Data Integrity**: Prevents data tampering during transmission
- **MITM Protection**: Mitigates man-in-the-middle attack risks

---

## Vulnerability 11 - Insecure File Uploads

### 4.11.1 Identified Issues

File uploading is an essential feature in modern web applications for sharing documents, images, videos, and other files. However, if not properly handled, it becomes a serious security threat:

#### **Issue 1: Lack of Validation**
- **Problem**: No validation on uploaded files allows users to upload malicious files containing scripts or executable code
- **Risk**: Remote code execution (RCE) or server exploitation
- **Impact**: Attackers can execute arbitrary code on the server, potentially gaining full system control

#### **Issue 2: No Size Restrictions**
- **Problem**: Absence of file size limits allows attackers to upload extremely large files
- **Risk**: Denial of Service (DoS) attacks
- **Impact**: Server resources are consumed, leading to reduced performance and potential service unavailability

#### **Issue 3: Insufficient File Name Sanitization**
- **Problem**: Poorly sanitized file names can contain special characters or path traversal sequences
- **Risk**: Directory traversal attacks and unauthorized file access
- **Impact**: Attackers can access files or directories outside the intended upload directory

### 4.11.2 How is the vulnerability fixed?

#### **Solution: Comprehensive File Upload Security**

I implemented a multi-layered security approach to address all identified file upload vulnerabilities:

#### **Fix 1: MIME Type Validation**
```javascript
// File upload middleware with MIME type validation
const multer = require('multer');
const path = require('path');

// Define allowed MIME types for images only
const allowedMimeTypes = [
  'image/jpeg',
  'image/png', 
  'image/webp'
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};
```

#### **Fix 2: Maximum File Size Limitation**
```javascript
// Configure multer with size limits
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file per request
  }
});
```

#### **Fix 3: File Name Sanitization**
```javascript
// File name sanitization function
const sanitizeFileName = (fileName) => {
  // Remove or replace characters that are not alphanumeric, dots, underscores, or hyphens
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
    .replace(/^\.+|\.+$/g, ''); // Remove leading/trailing dots
};

// Enhanced filename generation
const generateSafeFileName = (originalName) => {
  const timestamp = Date.now();
  const sanitizedName = sanitizeFileName(originalName);
  const extension = path.extname(sanitizedName);
  const baseName = path.basename(sanitizedName, extension);
  
  return `${baseName}_${timestamp}${extension}`;
};
```

#### **Complete Upload Handler:**
```javascript
// Express route with secure file upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Additional validation
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }

    // Generate safe filename
    const safeFileName = generateSafeFileName(req.file.originalname);
    
    // Process the uploaded file
    const fileInfo = {
      originalName: req.file.originalname,
      safeName: safeFileName,
      size: req.file.size,
      mimeType: req.file.mimetype,
      path: req.file.path
    };

    res.status(200).json({
      message: 'File uploaded successfully',
      file: fileInfo
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});
```

#### **Security Benefits:**
- **RCE Prevention**: MIME type validation prevents execution of malicious scripts
- **DoS Protection**: File size limits prevent resource exhaustion attacks
- **Path Traversal Prevention**: Filename sanitization prevents directory traversal
- **Data Integrity**: Safe file handling ensures system stability

---

## Vulnerability 12 - Server Leaks Information via "X-Powered-By"

### 4.12.1 Identified Issues

The "X-Powered-By" vulnerability occurs when a web server or application discloses information about its underlying technology through the HTTP response header "X-Powered-By":

#### **Issue 1: Technology Detection**
- **Problem**: Attackers can detect the software stack your application uses (e.g., Express.js, PHP, ASP.NET)
- **Risk**: Reconnaissance and targeted attack planning
- **Impact**: Attackers can research specific vulnerabilities associated with the identified technology stack

#### **Issue 2: Targeted Attacks**
- **Problem**: Knowledge of specific technology enables attackers to exploit known weaknesses or bugs in that framework
- **Risk**: Increased likelihood of successful attacks
- **Impact**: Attackers can use framework-specific attack vectors and exploit known vulnerabilities

### 4.12.2 How is the vulnerability fixed?

#### **Solution: Remove Technology Disclosure Headers**

I implemented a comprehensive solution to prevent information disclosure through HTTP headers:

#### **Implementation using Helmet.js:**
```javascript
// server.js - Security headers configuration
const helmet = require('helmet');

// Configure Helmet with security headers
app.use(helmet({
  // Remove X-Powered-By header
  hidePoweredBy: true,
  
  // Additional security headers
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  
  // Prevent clickjacking
  frameguard: { action: 'deny' },
  
  // XSS protection
  xssFilter: true,
  
  // Prevent MIME type sniffing
  noSniff: true,
  
  // Force HTTPS
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### **Alternative Implementation (Manual):**
```javascript
// Manual header removal
app.use((req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Remove other potentially revealing headers
  res.removeHeader('Server');
  res.removeHeader('X-AspNet-Version');
  res.removeHeader('X-AspNetMvc-Version');
  
  next();
});
```

#### **Verification:**
```bash
# Test to verify headers are removed
curl -I http://localhost:4000

# Expected output (X-Powered-By should be absent):
# HTTP/1.1 200 OK
# X-DNS-Prefetch-Control: off
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
```

#### **Security Benefits:**
- **Reduced Attack Surface**: Prevents technology stack disclosure
- **Reconnaissance Prevention**: Makes it harder for attackers to identify specific vulnerabilities
- **Enhanced Security**: Additional security headers provide comprehensive protection
- **Compliance**: Meets security best practices for information disclosure prevention

---

## Implementation Details

### **File Structure Changes:**
```
backend/
├── cert.pem                 # SSL Certificate
├── key.pem                  # SSL Private Key
├── uploads/                 # Secure upload directory
├── middleware/
│   └── uploadMiddleware.js  # File upload security
└── server.js               # Updated with security configs
```

### **Dependencies Added:**
```json
{
  "dependencies": {
    "helmet": "^7.0.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "mkcert": "^1.4.4"
  }
}
```

### **Environment Configuration:**
```bash
# .env file additions
HTTPS=true
SSL_CRT_FILE=./cert.pem
SSL_KEY_FILE=./key.pem
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

---

## Best Practices

### **SSL/TLS Best Practices:**
1. **Use Strong Cipher Suites**: Configure TLS with strong encryption algorithms
2. **Certificate Management**: Implement proper certificate rotation and monitoring
3. **HSTS Implementation**: Use HTTP Strict Transport Security headers
4. **Regular Updates**: Keep TLS libraries and configurations updated

### **File Upload Best Practices:**
1. **Whitelist Approach**: Only allow specific file types rather than blacklisting
2. **Virus Scanning**: Implement antivirus scanning for uploaded files
3. **Secure Storage**: Store uploaded files outside web root directory
4. **Access Controls**: Implement proper access controls for uploaded files

### **Information Disclosure Prevention:**
1. **Header Auditing**: Regularly audit HTTP response headers
2. **Security Scanning**: Use automated tools to detect information leaks
3. **Configuration Review**: Review server configurations for unnecessary disclosures
4. **Monitoring**: Implement monitoring for unusual header patterns

---

## Conclusion

The implementation of security fixes for the three assigned vulnerabilities significantly enhances the security posture of the Central Pet Care Management System:

### **Security Improvements Achieved:**
- ✅ **Encrypted Communication**: SSL/TLS implementation protects data in transit
- ✅ **Secure File Handling**: Comprehensive file upload security prevents multiple attack vectors
- ✅ **Information Protection**: Removal of technology disclosure headers reduces attack surface

### **Risk Mitigation:**
- **High-Risk Vulnerabilities**: All identified high-risk issues have been addressed
- **Attack Prevention**: Multiple attack vectors have been blocked
- **Compliance**: Implementation follows security best practices and standards

### **Future Recommendations:**
1. **Regular Security Audits**: Conduct periodic security assessments
2. **Automated Testing**: Integrate security testing into CI/CD pipeline
3. **Monitoring**: Implement real-time security monitoring and alerting
4. **Training**: Provide security awareness training for development team

The successful remediation of these vulnerabilities demonstrates the importance of proactive security measures in web application development and the effectiveness of comprehensive security testing and implementation strategies.

---

**Student**: IT21210174 - Tharushi Lakshika V.G.  
**Date**: September 2024  
**Course**: SE4030 – Secure Software Development
