# Security Analysis

## 🛡️ Security Overview

The Central Pet Care Management System implements multiple layers of security to protect sensitive data, ensure user authentication, and maintain system integrity. This analysis evaluates the current security implementation and identifies potential vulnerabilities.

## 🔐 Authentication & Authorization

### **JWT-Based Authentication**

#### **Token Structure**
```javascript
// JWT Payload
{
  "id": "user_object_id",
  "iat": 1640995200,  // Issued at timestamp
  "exp": 1641081600   // Expiration timestamp (24 hours)
}
```

#### **Token Generation**
```javascript
// utils/generateToken.js
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'  // 30-day expiration
  });
};
```

#### **Token Validation**
```javascript
// middleware/authMiddleware.js
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
```

### **Role-Based Access Control (RBAC)**

#### **User Roles**
- **Admin**: Full system access
- **Customer**: Limited access to personal data and shopping

#### **Admin Middleware**
```javascript
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
```

#### **Protected Routes**
```javascript
// Admin-only routes
router.get('/', protect, admin, getUsers);
router.post('/', protect, admin, createUser);
router.delete('/:id', protect, admin, deleteUser);

// User-specific routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
```

## 🔒 Password Security

### **Password Hashing**

#### **bcryptjs Implementation**
```javascript
// User model password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password comparison
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

#### **Security Features**
- **Salt Rounds**: 10 rounds for bcrypt hashing
- **Password Modification Check**: Only hash when password changes
- **Secure Comparison**: Constant-time comparison to prevent timing attacks

### **Password Validation**
```javascript
// Frontend validation
const validatePassword = (password) => {
  const errors = {};
  
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};
```

## 🌐 API Security

### **CORS Configuration**
```javascript
// server.js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **Input Validation**

#### **Mongoose Schema Validation**
```javascript
// User model validation
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add username'],
    unique: true,
    trim: true,
    maxlength: [50, 'Username cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add password'],
    minlength: 6
  }
});
```

#### **Request Validation**
```javascript
// Controller validation
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
```

### **Error Handling**
```javascript
// Centralized error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new Error(message);
    error.status = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.status = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message);
    error.status = 400;
  }

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
```

## 💳 Payment Security

### **Stripe Integration**
```javascript
// Stripe payment processing
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  shipping_address_collection: { allowed_countries: ['LK'] },
  phone_number_collection: { enabled: true },
  line_items,
  mode: 'payment',
  success_url: `${process.env.SERVER_URL}/api/checkout/create-order?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.CLIENT_URL}/cart`,
  metadata: { user: userId }
});
```

#### **Security Features**
- **PCI Compliance**: Stripe handles sensitive payment data
- **SSL/TLS**: Encrypted communication
- **Tokenization**: Card details never stored locally
- **Fraud Detection**: Stripe's built-in fraud prevention

### **Order Processing Security**
```javascript
// Secure order creation
const createOrder = async (session) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

    if (paymentIntent.status === 'succeeded') {
      const newOrder = new Order({
        user: session.metadata.user,
        orderItems: orderItems,
        shipping: shipping,
        subTotal: subTotal,
        shippingAmount: shippingAmount,
        total: total,
        paymentStatus: paymentIntent.status
      });
      
      await newOrder.save();
    }
  } catch (err) {
    console.log(err);
    res.redirect(`${process.env.CLIENT_URL}/cart`);
  }
};
```

## 🗄️ Database Security

### **MongoDB Security**

#### **Connection Security**
```javascript
// config/db.js
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
```

#### **Query Security**
- **NoSQL Injection Prevention**: Mongoose ODM provides protection
- **Parameterized Queries**: All queries use Mongoose methods
- **Input Sanitization**: Schema validation prevents malicious input

#### **Data Encryption**
- **Password Hashing**: bcryptjs with salt
- **Sensitive Data**: No plaintext storage of sensitive information
- **Connection Encryption**: MongoDB Atlas encryption in transit

### **Data Validation**
```javascript
// Product model validation
const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Please add product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add product price'],
    min: [0, 'Price cannot be negative']
  },
  SKU: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});
```

## 🔍 Frontend Security

### **XSS Prevention**

#### **Input Sanitization**
```javascript
// Input sanitization function
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// Usage in forms
const handleSubmit = (formData) => {
  const sanitizedData = {
    ...formData,
    description: sanitizeInput(formData.description)
  };
  // Process sanitized data
};
```

#### **React Security**
- **JSX Escaping**: React automatically escapes JSX content
- **dangerouslySetInnerHTML**: Not used in the application
- **Content Security Policy**: Implicit protection through React

### **Authentication State Management**
```javascript
// Secure token storage
const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.token) {
      // Validate token expiration
      const tokenExpiry = JSON.parse(atob(storedUser.token.split('.')[1])).exp;
      if (Date.now() >= tokenExpiry * 1000) {
        localStorage.removeItem('user');
        return;
      }
      setUser(storedUser);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
```

### **Protected Routes**
```javascript
// Route protection
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
```

## 🚨 Security Vulnerabilities & Risks

### **Identified Vulnerabilities**

#### **1. JWT Token Security**
- **Risk**: Long token expiration (30 days)
- **Impact**: Extended exposure if token is compromised
- **Recommendation**: Implement refresh tokens with shorter expiration

#### **2. Password Policy**
- **Risk**: Weak password requirements (minimum 6 characters)
- **Impact**: Susceptible to brute force attacks
- **Recommendation**: Implement stronger password policy

#### **3. Rate Limiting**
- **Risk**: No rate limiting on authentication endpoints
- **Impact**: Vulnerable to brute force attacks
- **Recommendation**: Implement rate limiting middleware

#### **4. Input Validation**
- **Risk**: Limited server-side validation on some endpoints
- **Impact**: Potential injection attacks
- **Recommendation**: Comprehensive input validation

#### **5. Error Information Disclosure**
- **Risk**: Detailed error messages in responses
- **Impact**: Information leakage to attackers
- **Recommendation**: Generic error messages for production

### **Security Gaps**

#### **1. Session Management**
- **Missing**: Session invalidation on logout
- **Missing**: Concurrent session management
- **Missing**: Session timeout handling

#### **2. Audit Logging**
- **Missing**: Security event logging
- **Missing**: Failed login attempt tracking
- **Missing**: Administrative action logging

#### **3. Data Encryption**
- **Missing**: Database encryption at rest
- **Missing**: Sensitive data field encryption
- **Missing**: Backup encryption

## 🛡️ Security Recommendations

### **Immediate Improvements**

#### **1. Implement Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/users/login', authLimiter);
```

#### **2. Strengthen Password Policy**
```javascript
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128
};

const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < passwordPolicy.minLength) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return errors;
};
```

#### **3. Implement Refresh Tokens**
```javascript
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};
```

#### **4. Add Security Headers**
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### **Long-term Security Enhancements**

#### **1. Implement Audit Logging**
```javascript
const auditLog = (action, userId, details) => {
  const logEntry = {
    timestamp: new Date(),
    action,
    userId,
    details,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };
  
  // Store in secure audit log collection
  AuditLog.create(logEntry);
};
```

#### **2. Database Encryption**
- **At Rest**: Enable MongoDB encryption at rest
- **In Transit**: Ensure TLS 1.2+ for all connections
- **Application Level**: Encrypt sensitive fields

#### **3. Security Monitoring**
- **Intrusion Detection**: Monitor for suspicious activities
- **Anomaly Detection**: Track unusual user behavior
- **Real-time Alerts**: Immediate notification of security events

#### **4. Regular Security Audits**
- **Code Reviews**: Regular security-focused code reviews
- **Penetration Testing**: Periodic security testing
- **Dependency Updates**: Keep all dependencies updated
- **Security Training**: Team security awareness training

## 📊 Security Metrics

### **Current Security Score: 7/10**

#### **Strengths**
- ✅ JWT authentication implementation
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Input validation with Mongoose
- ✅ Stripe payment security
- ✅ Protected routes implementation

#### **Areas for Improvement**
- ⚠️ Rate limiting implementation
- ⚠️ Password policy strengthening
- ⚠️ Session management enhancement
- ⚠️ Audit logging implementation
- ⚠️ Security headers addition

### **Risk Assessment**

#### **High Risk**
- Brute force attacks on authentication
- Session hijacking vulnerabilities

#### **Medium Risk**
- Information disclosure through errors
- Weak password policies

#### **Low Risk**
- XSS vulnerabilities (mitigated by React)
- CSRF attacks (mitigated by CORS)

---

*The system demonstrates a solid foundation for security with room for improvement in authentication robustness, monitoring, and comprehensive security policies.*
