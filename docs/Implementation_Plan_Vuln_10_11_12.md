## Implementation Plan: Vulnerabilities 10–12 (SSL/TLS, Secure Uploads, X-Powered-By)

Owner: IT18149890 (Dhanushikan V.)  
Date: September 2025  
Scope: Backend (Node/Express), Frontend (React)  
References: `Security_Fixes_Implementation_Report.md`, `Security_Vulnerabilities_Report_Student4.md`

---

### Objectives
- Enforce HTTPS in dev/prod for encrypted transport (Vuln 10)
- Implement secure file upload pipeline with strict validation (Vuln 11)
- Remove technology disclosure via response headers and add security headers (Vuln 12)

---

### Assumptions
- Local dev will use self-signed certs via mkcert.
- Production will terminate TLS at reverse proxy (Nginx/Cloud) and forward to Node over localhost.
- No breaking changes to existing API contracts.

---

### Deliverables
- Backend: HTTPS support (dev), `helmet` security headers, secure upload middleware + routes
- Frontend: HTTPS dev config, axios credentials alignment (no token in localStorage for OAuth paths)
- Docs: SSL setup guide, upload usage guide, env templates

---

### Work Breakdown Structure (WBS)

1) SSL/TLS (Vulnerability 10)
- Create certificates (dev): mkcert keys committed to gitignore
- Backend: enable HTTPS server in dev; support env-driven ports and file paths
- Frontend: opt-in HTTPS dev via `.env` (HTTPS=true) and cert paths
- CORS: update to `https://localhost:3000` with credentials
- HSTS: apply only in production via Helmet
- Acceptance: Browser shows padlock; curl verifies TLS; mixed content free

2) Insecure File Uploads (Vulnerability 11)
- Add `multer` and create `middleware/uploadMiddleware.js` with:
  - MIME whitelist: image/jpeg, image/png, image/webp
  - Max size: 5MB; single file per request
  - Safe filename sanitization and unique naming
  - Store under `backend/uploads` (non-public)
- Create `routes/uploadRoutes.js`:
  - POST `/api/upload/image` (protected if needed)
  - GET `/api/upload/:id` (optional restricted retrieval)
- Integrate routes in `server.js`
- Acceptance: Invalid MIME/oversize rejected; valid image stored with sanitized name

3) X-Powered-By / Security Headers (Vulnerability 12)
- Add `helmet` and configure:
  - hidePoweredBy, frameguard deny, noSniff, xssFilter, referrer policy
  - CSP with conservative defaults; allow needed assets
  - HSTS in production
- Remove any duplicate manual header settings
- Acceptance: Response headers verified; `X-Powered-By` absent; CSP effective

---

### Detailed Steps & Commands

1. Dependencies
```bash
# Backend
cd backend
npm install helmet multer

# (Optional) Dev tool for certs installed outside repo
brew install mkcert || choco install mkcert
mkcert -install
mkcert -cert-file ./cert.pem -key-file ./key.pem localhost 127.0.0.1 ::1
```

2. Env configuration
```bash
# backend/.env (example)
PORT=4000
HTTPS_PORT=4443
SSL_CERT_PATH=./cert.pem
SSL_KEY_PATH=./key.pem
CORS_ORIGIN=https://localhost:3000
NODE_ENV=development
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# frontend/.env
HTTPS=true
SSL_CRT_FILE=./cert.pem
SSL_KEY_FILE=./key.pem
REACT_APP_API_ORIGIN=https://localhost:4000
```

3. Backend code changes
- server.js
  - Load certs in dev if paths exist and start HTTPS server
  - Apply Helmet with CSP and HSTS (prod only)
  - Update CORS to `https://localhost:3000` with `credentials: true`
  - Mount `/api/upload` routes
- middleware/uploadMiddleware.js
  - Export configured multer instance and sanitization helpers
- routes/uploadRoutes.js
  - Define endpoints; ensure proper error handling

4. Frontend updates
- Confirm axios clients:
  - `axios-client.js` uses `withCredentials: true` and base URL from env
  - Avoid mixing localStorage tokens for OAuth-only flows
- Ensure dev server runs over HTTPS using provided certs

---

### Testing & Verification
- TLS
  - Open `https://localhost:3000` and call backend endpoints without mixed content warnings
  - `curl -kI https://localhost:4000` returns no `X-Powered-By`
- Uploads
  - Upload valid image (<=5MB) → 200; store with sanitized name
  - Upload disallowed type/oversized → 400 with clear error
- Headers
  - Verify Helmet headers present; CSP not blocking legitimate assets

---

### Risks & Mitigations
- Cert path issues: document paths; add existence checks
- CSP breakage: start with report-only (optional) then enforce
- Large file uploads: enforce limits; monitor logs

---

### Timeline (Team of Four)
- Day 1: SSL/TLS dev setup, Helmet baseline
- Day 2: Upload middleware + routes, tests
- Day 3: CSP tuning, HSTS prod switch, docs
- Day 4: Regression tests, finalize report and evidence

---

### Acceptance Criteria (DoD)
- All endpoints accessible over HTTPS in dev; no mixed content
- `X-Powered-By` removed; security headers verified
- Upload route rejects invalid files and accepts valid images with limits
- Documentation updated; env templates added
