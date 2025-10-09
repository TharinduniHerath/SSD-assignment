# API Analysis

## 🌐 RESTful API Design

### **Base URL**: `http://localhost:4000/api`
### **Protocol**: HTTP/HTTPS
### **Content Type**: JSON
### **Authentication**: JWT Bearer Token

## 📋 API Endpoints Overview

### **Authentication Endpoints**
```
POST   /api/users/login              - User authentication
POST   /api/users                    - User registration
GET    /api/users/profile            - Get user profile (Protected)
PUT    /api/users/profile            - Update user profile (Protected)
GET    /api/users                    - Get all users (Admin)
DELETE /api/users/:id                - Delete user (Admin)
PUT    /api/users/:id                - Update user (Admin)
GET    /api/users/stats              - User statistics (Admin)
```

**Request/Response Examples:**
```javascript
// POST /api/users/login
Request: {
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "_id": "user_id",
  "username": "john_doe",
  "email": "user@example.com",
  "isAdmin": false,
  "token": "jwt_token_here"
}

// GET /api/users/profile
Headers: { "Authorization": "Bearer jwt_token" }
Response: {
  "_id": "user_id",
  "username": "john_doe",
  "email": "user@example.com",
  "isAdmin": false
}
```

### **Product Management APIs**
```
GET    /api/products                 - Get all products
POST   /api/products                 - Create product (Admin)
GET    /api/products/:id             - Get product by ID
PUT    /api/products/:id             - Update product (Admin)
DELETE /api/products/:id             - Delete product (Admin)
GET    /api/products/search          - Search products
```

**Request/Response Examples:**
```javascript
// POST /api/products
Request: {
  "productName": "Dog Food Premium",
  "brand": "PetCare",
  "categories": { "category": "Food", "subcategory": "Dry Food" },
  "quantity": 100,
  "price": 2500,
  "description": "High-quality dog food",
  "SKU": "DF001",
  "image": "image_url"
}
Response: {
  "productId": "P0001",
  "productName": "Dog Food Premium",
  "brand": "PetCare",
  "quantity": 100,
  "price": 2500,
  "inStock": true,
  "_id": "product_object_id"
}
```

### **Order Management APIs**
```
GET    /api/orders                   - Get all orders (Admin)
POST   /api/orders                   - Create order
GET    /api/orders/:id               - Get order by ID
PUT    /api/orders/:id               - Update order (Admin)
DELETE /api/orders/:id               - Delete order (Admin)
GET    /api/orders/user/:id          - Get user orders
```

**Request/Response Examples:**
```javascript
// POST /api/orders
Request: {
  "orderItems": [
    {
      "productId": "product_id",
      "productName": "Dog Food",
      "image": "image_url",
      "unitPrice": 2500,
      "quantity": 2,
      "productTotal": 5000
    }
  ],
  "subTotal": 5000,
  "shippingAmount": 500,
  "total": 5500,
  "shipping": {
    "name": "John Doe",
    "address": {
      "line1": "123 Main St",
      "city": "Colombo",
      "postal_code": "10000",
      "country": "LK"
    },
    "phone": "+94771234567"
  },
  "paymentStatus": "succeeded"
}
Response: {
  "orderId": "ORD0001",
  "orderItems": [...],
  "subTotal": 5000,
  "total": 5500,
  "deliveryStatus": "Pending",
  "_id": "order_object_id"
}
```

### **Cart Management APIs**
```
GET    /api/carts                    - Get user cart (Protected)
POST   /api/carts                    - Add item to cart (Protected)
PUT    /api/carts/:id                - Update cart item (Protected)
DELETE /api/carts/:id                - Remove cart item (Protected)
DELETE /api/carts                    - Clear cart (Protected)
```

**Request/Response Examples:**
```javascript
// POST /api/carts
Request: {
  "product": "product_id",
  "cartQuantity": 2
}
Response: {
  "user": "user_id",
  "cartItems": [
    {
      "product": "product_id",
      "cartQuantity": 2
    }
  ],
  "_id": "cart_object_id"
}
```

### **Payment Processing APIs**
```
POST   /api/checkout/create-checkout-session           - Create Stripe session
POST   /api/checkout/create-checkout-session-logged-in  - Create session for logged users
GET    /api/checkout/create-order                      - Process successful payment
```

**Request/Response Examples:**
```javascript
// POST /api/checkout/create-checkout-session-logged-in
Request: {
  "cartItems": [
    {
      "product": {
        "_id": "product_id",
        "productName": "Dog Food",
        "price": 2500,
        "image": "image_url"
      },
      "cartQuantity": 2
    }
  ]
}
Response: {
  "url": "https://checkout.stripe.com/pay/cs_..."
}
```

### **Pet Management APIs**
```
GET    /api/pets                     - Get all pets
POST   /api/pets                     - Register pet
GET    /api/pets/:id                 - Get pet by ID
PUT    /api/pets/:id                 - Update pet
DELETE /api/pets/:id                 - Delete pet
GET    /api/pets/search              - Search pets

GET    /api/treatments               - Get all treatments
POST   /api/treatments               - Add treatment
GET    /api/treatments/:id           - Get treatment by ID
PUT    /api/treatments/:id           - Update treatment
DELETE /api/treatments/:id           - Delete treatment
```

**Request/Response Examples:**
```javascript
// POST /api/pets
Request: {
  "petID": "PET001",
  "petName": "Buddy",
  "age": "3 years",
  "gender": "Male",
  "species": "Dog",
  "breed": "Golden Retriever",
  "nic": "123456789V",
  "customerName": "John Doe",
  "contactNumber": 771234567,
  "medicalHistory": "No known allergies",
  "picture": "pet_image_url"
}
Response: {
  "petID": "PET001",
  "petName": "Buddy",
  "species": "Dog",
  "breed": "Golden Retriever",
  "_id": "pet_object_id"
}
```

### **Appointment Management APIs**
```
GET    /api/appointments             - Get all appointments
POST   /api/appointments             - Create appointment
GET    /api/appointments/:id         - Get appointment by ID
PUT    /api/appointments/:id         - Update appointment
DELETE /api/appointments/:id         - Delete appointment
```

**Request/Response Examples:**
```javascript
// POST /api/appointments
Request: {
  "ownerName": "John Doe",
  "ownerContact": "771234567",
  "petName": "Buddy",
  "petAge": 3,
  "petSpecies": "Dog",
  "petGender": "Male",
  "reason": "Annual checkup",
  "date": "2024-01-15",
  "additionalNote": "Pet is healthy"
}
Response: {
  "appointmentId": "APT0001",
  "ownerName": "John Doe",
  "petName": "Buddy",
  "status": "Pending",
  "_id": "appointment_object_id"
}
```

### **Staff Management APIs**
```
GET    /api/staff                    - Get all staff
POST   /api/staff                    - Add staff member
GET    /api/staff/:id                - Get staff by ID
PUT    /api/staff/:id                - Update staff
DELETE /api/staff/:id                - Delete staff

GET    /api/leave                     - Get all leave records
POST   /api/leave                     - Add leave request
PUT    /api/leave/:id                 - Update leave
DELETE /api/leave/:id                 - Delete leave

GET    /api/payroll                   - Get all payroll records
POST   /api/payroll                   - Add payroll
PUT    /api/payroll/:id               - Update payroll
DELETE /api/payroll/:id               - Delete payroll
```

**Request/Response Examples:**
```javascript
// POST /api/staff
Request: {
  "firstName": "Jane",
  "lastName": "Smith",
  "address": "123 Main St, Colombo",
  "nic": "987654321V",
  "contactNo": 771234567,
  "dob": "1990-01-01",
  "email": "jane@example.com",
  "department": "Veterinary",
  "designation": "Veterinarian",
  "joinedDate": "2023-01-01",
  "salary": 75000,
  "simage": "staff_image_url"
}
Response: {
  "staffId": "SID0001",
  "firstName": "Jane",
  "lastName": "Smith",
  "department": "Veterinary",
  "designation": "Veterinarian",
  "_id": "staff_object_id"
}
```

### **Inventory Management APIs**
```
GET    /api/inventory                 - Get all inventory items
POST   /api/inventory                - Add inventory item
GET    /api/inventory/:id            - Get item by ID
PUT    /api/inventory/:id            - Update item
DELETE /api/inventory/:id            - Delete item

GET    /api/suppliers                 - Get all suppliers
POST   /api/suppliers                - Add supplier
GET    /api/suppliers/:id            - Get supplier by ID
PUT    /api/suppliers/:id            - Update supplier
DELETE /api/suppliers/:id            - Delete supplier

GET    /api/release-items             - Get released items
POST   /api/release-items            - Release items
```

**Request/Response Examples:**
```javascript
// POST /api/inventory
Request: {
  "sku": "INV001",
  "itemName": "Surgical Gloves",
  "category": "Medical Supplies",
  "price": 500,
  "rackNo": "A-01",
  "quantity": 1000,
  "manufacturer": "MedSupply Co",
  "reorderLevel": 100,
  "measurementUnit": "pairs",
  "productImage": "image_url"
}
Response: {
  "sku": "INV001",
  "itemName": "Surgical Gloves",
  "category": "Medical Supplies",
  "quantity": 1000,
  "_id": "item_object_id"
}
```

### **Delivery Management APIs**
```
GET    /api/drivers                   - Get all drivers
POST   /api/drivers                   - Add driver
GET    /api/drivers/:id               - Get driver by ID
PUT    /api/drivers/:id               - Update driver
DELETE /api/drivers/:id               - Delete driver

GET    /api/deliver-orders            - Get delivery orders
POST   /api/deliver-orders            - Create delivery order
PUT    /api/deliver-orders/:id        - Update delivery status
```

**Request/Response Examples:**
```javascript
// POST /api/drivers
Request: {
  "driverName": "Mike Johnson",
  "nicNumber": "123456789V",
  "driversLicenceNo": "DL123456",
  "vehicleRegNo": "ABC-1234",
  "permAddress": "456 Oak St, Colombo",
  "phoneNum": "771234567",
  "vehicleType": "Motorcycle",
  "driverStatus": "Available"
}
Response: {
  "driverName": "Mike Johnson",
  "vehicleRegNo": "ABC-1234",
  "driverStatus": "Available",
  "_id": "driver_object_id"
}
```

### **Veterinary Management APIs**
```
GET    /api/vets                      - Get all veterinarians
POST   /api/vets                      - Add veterinarian
GET    /api/vets/:id                  - Get vet by ID
PUT    /api/vets/:id                  - Update vet
DELETE /api/vets/:id                  - Delete vet

GET    /api/prescriptions             - Get all prescriptions
POST   /api/prescriptions             - Add prescription
GET    /api/prescriptions/:id         - Get prescription by ID
PUT    /api/prescriptions/:id         - Update prescription
DELETE /api/prescriptions/:id         - Delete prescription

GET    /api/medicines                 - Get all medicines
POST   /api/medicines                 - Add medicine
PUT    /api/medicines/:id             - Update medicine
DELETE /api/medicines/:id             - Delete medicine
```

**Request/Response Examples:**
```javascript
// POST /api/vets
Request: {
  "vcslId": "VCSL001",
  "vetName": "Dr. Sarah Wilson",
  "telephone": "771234567",
  "email": "sarah@vetclinic.com",
  "experience": "5 years",
  "qualification": "DVM",
  "profilePicture": "vet_image_url"
}
Response: {
  "vcslId": "VCSL001",
  "vetName": "Dr. Sarah Wilson",
  "qualification": "DVM",
  "_id": "vet_object_id"
}
```

### **Service Management APIs**
```
GET    /api/services                  - Get all services
POST   /api/services                  - Add service
GET    /api/services/:id              - Get service by ID
PUT    /api/services/:id              - Update service
DELETE /api/services/:id              - Delete service

GET    /api/servicerecords             - Get all service records
POST   /api/servicerecords             - Add service record
GET    /api/servicerecords/:id         - Get record by ID
PUT    /api/servicerecords/:id         - Update record
DELETE /api/servicerecords/:id         - Delete record
```

**Request/Response Examples:**
```javascript
// POST /api/services
Request: {
  "serviceId": "SVC001",
  "serviceName": "Vaccination",
  "serviceCharge": 2000,
  "serviceDescription": "Annual vaccination for pets",
  "serviceImage": "service_image_url"
}
Response: {
  "serviceId": "SVC001",
  "serviceName": "Vaccination",
  "serviceCharge": 2000,
  "_id": "service_object_id"
}
```

## 🔐 Authentication & Authorization

### **JWT Token Structure**
```javascript
{
  "id": "user_object_id",
  "iat": 1640995200,  // Issued at timestamp
  "exp": 1641081600   // Expiration timestamp
}
```

### **Authorization Headers**
```javascript
// Required for protected endpoints
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

### **Protected Routes**
- **Admin Only**: All CRUD operations for system management
- **Authenticated Users**: User-specific operations (cart, orders, profile)
- **Public**: Product catalog, appointment booking, user registration

### **Role-Based Access Control**
```javascript
// Middleware Implementation
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
```

## 📊 API Response Formats

### **Success Response**
```javascript
{
  "status": 200,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### **Error Response**
```javascript
{
  "status": 400,
  "error": "Validation Error",
  "details": {
    "field": "email",
    "message": "Email is required"
  }
}
```

### **Pagination Response**
```javascript
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### **List Response**
```javascript
{
  "data": [
    {
      "_id": "object_id",
      "name": "Item Name",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

## 🔄 API Workflow Examples

### **Complete Order Processing Workflow**
```
1. GET /api/products                    - Browse products
2. POST /api/carts                      - Add items to cart
3. GET /api/carts                       - Review cart
4. POST /api/checkout/create-checkout-session-logged-in - Create payment session
5. GET /api/checkout/create-order        - Process successful payment
6. POST /api/orders                     - Create order record
7. PUT /api/products/:id                - Update inventory quantities
8. POST /api/deliver-orders             - Create delivery order
9. PUT /api/deliver-orders/:id           - Update delivery status
```

### **Appointment Booking Workflow**
```
1. POST /api/appointments               - Create appointment
2. GET /api/appointments                - Admin views appointments
3. PUT /api/appointments/:id            - Update appointment status
4. POST /api/treatments                 - Add treatment record
5. POST /api/prescriptions              - Create prescription
6. PUT /api/pets/:id                    - Update pet medical history
```

### **Staff Management Workflow**
```
1. POST /api/staff                      - Add staff member
2. POST /api/leave                      - Staff requests leave
3. PUT /api/leave/:id                   - Admin approves/rejects leave
4. POST /api/payroll                    - Process payroll
5. GET /api/staff/stats                 - View staff statistics
```

## 🛡️ Security Features

### **Input Validation**
```javascript
// Mongoose Schema Validation
const userSchema = mongoose.Schema({
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

### **Rate Limiting**
```javascript
// Express Rate Limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### **CORS Configuration**
```javascript
// CORS Setup
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **Error Handling**
```javascript
// Centralized Error Handler
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

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
```

## 📈 Performance Optimizations

### **Database Queries**
- **Indexed Fields**: All search and filter operations use indexed fields
- **Projection**: Limit returned fields to reduce payload size
- **Pagination**: Implement pagination for large datasets
- **Aggregation**: Use MongoDB aggregation pipelines for complex queries

### **Caching Strategy**
- **Response Caching**: Cache frequently accessed data
- **Static Assets**: Cache images and static files
- **API Response**: Cache product catalog and service lists
- **Session Data**: Cache user sessions and cart data

### **Request Optimization**
- **Batch Operations**: Group multiple operations where possible
- **Compression**: Enable gzip compression for responses
- **Connection Pooling**: Efficient database connections
- **Async Operations**: Non-blocking I/O operations

## 🔧 API Testing

### **Test Endpoints**
```bash
# Authentication Test
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Product Creation Test
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token" \
  -d '{"productName":"Test Product","brand":"Test Brand","price":100}'
```

### **Response Validation**
- **Status Codes**: Proper HTTP status codes
- **Data Types**: Correct data types in responses
- **Required Fields**: All required fields present
- **Error Messages**: Clear and descriptive error messages

---

*This API provides a comprehensive RESTful interface for managing all aspects of the veterinary clinic and e-commerce operations with proper authentication, validation, and error handling.*
