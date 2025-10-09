# Database Schema Analysis

## 🗄️ Database Design Overview

### **Database Type**: MongoDB (NoSQL Document Database)
### **ODM**: Mongoose (Object Document Mapper)
### **Total Collections**: 20+ entities
### **Design Pattern**: Document-based with embedded and referenced relationships

## 📊 Entity Relationship Analysis

### **Core Business Entities**

#### **1. User Management**
```javascript
// User Collection
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- username: unique
- email: unique
- Text index on username, email
```

#### **2. Product Management**
```javascript
// Product Collection
{
  _id: ObjectId,
  productId: String (unique, auto-generated: P0001),
  productName: String (required),
  brand: String (required),
  categories: Object (required),
  quantity: Number (required),
  price: Number (required),
  description: String (required),
  SKU: String (unique, required),
  inStock: Boolean (default: true),
  image: String (required),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- productId: unique
- SKU: unique
- Text index on productId, productName, brand, categories, description, SKU
```

#### **3. Order Management**
```javascript
// Order Collection
{
  _id: ObjectId,
  orderId: String (unique, auto-generated: ORD0001),
  user: ObjectId (ref: 'User', optional),
  orderItems: [{
    productId: ObjectId (ref: 'Product'),
    productName: String,
    image: String,
    unitPrice: Number,
    quantity: Number (default: 1),
    productTotal: Number
  }],
  subTotal: Number (required),
  shippingAmount: Number (required),
  total: Number (required),
  shipping: Object (required),
  paymentStatus: String (required),
  deliveryStatus: String (default: "Pending"),
  assignedDriver: String (default: ""),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- orderId: unique
- Text index on orderId
```

#### **4. Cart Management**
```javascript
// Cart Collection
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  cartItems: [{
    product: ObjectId (ref: 'Product'),
    cartQuantity: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### **5. Pet Management**
```javascript
// PetRegister Collection
{
  _id: ObjectId,
  petID: String (unique, required),
  petName: String (required),
  age: String (required),
  gender: String (required),
  species: String (required),
  breed: String (required),
  nic: String (required),
  customerName: String (required),
  contactNumber: Number (required),
  medicalHistory: String (required),
  picture: String (required),
  createdAt: Date,
  updatedAt: Date
}

// PetTreatments Collection
{
  _id: ObjectId,
  petID: String (required),
  petName: String (required),
  nic: String (required),
  date: String (required),
  treatment: String (required),
  progressNotes: String (required),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- petID: unique (PetRegister)
- Text index on petID, petName, age, gender, species, breed, nic, customerName, contactNumber, medicalHistory
- Text index on petID, petName, nic, date, treatment, progressNotes (PetTreatments)
```

#### **6. Appointment Management**
```javascript
// Appointment Collection
{
  _id: ObjectId,
  appointmentId: String (unique, auto-generated: APT0001),
  ownerName: String (required),
  ownerContact: String (required),
  petName: String (required),
  petAge: Number (required),
  petSpecies: String (required),
  petGender: String (required),
  reason: String (required),
  date: String (required),
  additionalNote: String (required),
  status: String (default: "Pending"),
  vet: String (optional),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- appointmentId: unique
```

#### **7. Staff Management**
```javascript
// Staff Collection
{
  _id: ObjectId,
  staffId: String (unique, auto-generated: SID0001),
  firstName: String (required),
  lastName: String (required),
  address: String (required),
  nic: String (required),
  contactNo: Number (required),
  dob: String (required),
  email: String (required),
  department: String (required),
  designation: String (required),
  joinedDate: String (required),
  salary: Number (required),
  simage: String (required),
  createdAt: Date,
  updatedAt: Date
}

// Leave Collection
{
  _id: ObjectId,
  leaveId: String (unique, auto-generated),
  staffId: String (required),
  staffName: String (required),
  leaveType: String (required),
  startDate: String (required),
  endDate: String (required),
  reason: String (required),
  status: String (default: "Pending"),
  createdAt: Date,
  updatedAt: Date
}

// Payroll Collection
{
  _id: ObjectId,
  payrollId: String (unique, auto-generated),
  staffId: String (required),
  staffName: String (required),
  basicSalary: Number (required),
  allowances: Number (default: 0),
  deductions: Number (default: 0),
  netSalary: Number (required),
  month: String (required),
  year: String (required),
  status: String (default: "Pending"),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- staffId: unique (Staff)
- Text index on firstName, lastName, address, nic, email, staffId, department, designation
```

#### **8. Inventory Management**
```javascript
// Item Collection
{
  _id: ObjectId,
  sku: String (required),
  itemName: String (required),
  category: String (required),
  price: Number (required),
  rackNo: String (required),
  quantity: Number (required),
  manufacturer: String (required),
  reorderLevel: Number (optional),
  measurementUnit: String (required),
  productImage: String (required),
  createdAt: Date,
  updatedAt: Date
}

// Supplier Collection
{
  _id: ObjectId,
  companyName: String (required),
  businessType: String (required),
  agentName: String (required),
  agentID: String (required),
  supplierCategory: String (required),
  supplyingItem: String (required),
  email: String (required),
  phone: String (required),
  companyAddress: String (required),
  createdAt: Date,
  updatedAt: Date
}

// ReleaseItem Collection
{
  _id: ObjectId,
  releaseId: String (unique, auto-generated),
  itemId: String (required),
  itemName: String (required),
  quantity: Number (required),
  releasedTo: String (required),
  releaseDate: String (required),
  purpose: String (required),
  status: String (default: "Released"),
  createdAt: Date,
  updatedAt: Date
}
```

#### **9. Veterinary Management**
```javascript
// Vets Collection
{
  _id: ObjectId,
  vcslId: String (unique),
  vetName: String (required),
  telephone: String (required),
  email: String (required),
  experience: String (required),
  qualification: String (required),
  profilePicture: String (required),
  createdAt: Date,
  updatedAt: Date
}

// Medicine Collection
{
  _id: ObjectId,
  medicineName: String (unique, required),
  uses: String (required),
  createdAt: Date,
  updatedAt: Date
}

// Prescription Collection
{
  _id: ObjectId,
  prescriptionId: String (unique, auto-generated),
  petID: String (required),
  vetId: String (required),
  medicines: [{
    medicineName: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  instructions: String (required),
  date: String (required),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- vcslId: unique (Vets)
- medicineName: unique (Medicine)
- Text index on vcslId, vetName, telephone, email, experience, qualification
- Text index on medicineName, uses
```

#### **10. Service Management**
```javascript
// Service Collection
{
  _id: ObjectId,
  serviceId: String (unique),
  serviceName: String (required),
  serviceCharge: Number (required),
  serviceDescription: String (required),
  serviceImage: String (required),
  createdAt: Date,
  updatedAt: Date
}

// ServiceRecords Collection
{
  _id: ObjectId,
  recordId: String (unique, auto-generated),
  serviceId: String (required),
  petId: String (required),
  customerId: String (required),
  date: String (required),
  notes: String (required),
  status: String (default: "Completed"),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- serviceId: unique (Service)
- Text index on serviceId, serviceName
```

#### **11. Delivery Management**
```javascript
// Driver Collection
{
  _id: ObjectId,
  driverName: String (required),
  nicNumber: String (required),
  driversLicenceNo: String (required),
  vehicleRegNo: String (required),
  permAddress: String (required),
  phoneNum: String (required),
  vehicleType: String (required),
  driverStatus: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### **12. Counter Collection (System)**
```javascript
// Counter Collection (Auto-increment IDs)
{
  _id: String (e.g., 'productId', 'orderId', 'appointmentId'),
  seq: Number (default: 0)
}
```

## 🔑 Key Design Patterns

### **1. Auto-Incrementing ID System**
The system implements a custom counter mechanism for generating unique business IDs:

```javascript
// Counter Model
const counterSchema = mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Usage in Models
productSchema.pre('save', async function (next) {
  if (!this.productId) {
    const counter = await Counter.findOneAndUpdate(
      { _id: 'productId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.productId = `P${counter.seq.toString().padStart(4, '0')}`;
  }
  next();
});
```

**Generated ID Formats:**
- Products: `P0001`, `P0002`, `P0003`...
- Orders: `ORD0001`, `ORD0002`, `ORD0003`...
- Appointments: `APT0001`, `APT0002`, `APT0003`...
- Staff: `SID0001`, `SID0002`, `SID0003`...

### **2. Text Search Indexing**
Comprehensive full-text search capabilities across multiple fields:

```javascript
// Example: Product Model
productSchema.index({
  productId: 'text',
  productName: 'text',
  brand: 'text',
  categories: 'text',
  description: 'text',
  SKU: 'text'
});
```

### **3. Reference Relationships**
Strategic use of MongoDB references for data integrity:

```javascript
// Order Model
orderItems: [{
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  // ... other fields
}]

// Cart Model
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
```

### **4. Embedded Documents**
Efficient data modeling with embedded documents:

```javascript
// Order Items (embedded)
orderItems: [{
  productId: ObjectId,
  productName: String,
  image: String,
  unitPrice: Number,
  quantity: Number,
  productTotal: Number
}]

// Prescription Medicines (embedded)
medicines: [{
  medicineName: String,
  dosage: String,
  frequency: String,
  duration: String
}]
```

## 📈 Database Performance Features

### **Indexing Strategy**

#### **Primary Indexes**
- `_id`: Default MongoDB primary key
- Unique business keys: `productId`, `orderId`, `appointmentId`, `staffId`

#### **Text Indexes**
- Full-text search on names, descriptions, and key fields
- Multi-field text indexes for comprehensive search

#### **Compound Indexes**
- User + timestamp for order history
- Status + date for appointment filtering
- Category + price for product filtering

### **Query Optimization**

#### **Aggregation Pipelines**
```javascript
// User Statistics Example
const data = await User.aggregate([
  { $match: { createdAt: { $gte: lastYear } } },
  { $project: { month: { $month: "$createdAt" } } },
  { $group: { _id: "$month", total: { $sum: 1 } } }
]);
```

#### **Efficient Queries**
- Indexed field queries for fast lookups
- Projection to limit returned fields
- Pagination for large result sets
- Sorting on indexed fields

### **Data Validation**

#### **Schema Validation**
```javascript
// Required Fields
username: { type: String, required: [true, 'Please add username'] }

// Unique Constraints
email: { type: String, unique: true }

// Data Types
price: { type: Number, required: true }

// Default Values
isAdmin: { type: Boolean, default: false }
```

#### **Custom Validation**
```javascript
// Password Hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Auto Stock Management
productSchema.pre('save', async function (next) {
  if (this.quantity < 0) {
    this.inStock = false;
  }
  next();
});
```

## 🛡️ Data Security Features

### **Password Security**
- **bcryptjs Hashing**: Salt rounds for password protection
- **Pre-save Middleware**: Automatic password hashing
- **Password Comparison**: Secure password verification

### **Data Integrity**
- **Schema Validation**: Required field enforcement
- **Unique Constraints**: Prevent duplicate entries
- **Data Type Enforcement**: Type safety
- **Custom Validators**: Business rule validation

### **Access Control**
- **JWT Authentication**: Secure API access
- **Role-Based Access**: Admin vs Customer permissions
- **Protected Routes**: Middleware-based protection

## 🚀 Scalability Considerations

### **Horizontal Scaling**
- **MongoDB Sharding**: Distribute data across multiple servers
- **Replica Sets**: High availability and read scaling
- **Connection Pooling**: Efficient database connections

### **Data Archiving**
- **Timestamp Fields**: Audit trail maintenance
- **Soft Delete**: Data retention capabilities
- **Historical Data**: Treatment and order history
- **Archive Collections**: Separate archived data

### **Performance Monitoring**
- **Query Profiling**: Identify slow queries
- **Index Usage**: Monitor index efficiency
- **Connection Monitoring**: Database health tracking
- **Storage Optimization**: Data compression and cleanup

## 📊 Data Relationships

### **One-to-Many Relationships**
- User → Orders
- Product → Order Items
- Pet → Treatments
- Staff → Leave Records
- Staff → Payroll Records

### **Many-to-Many Relationships**
- Orders ↔ Products (through Order Items)
- Pets ↔ Treatments
- Services ↔ Service Records

### **Reference Integrity**
- Foreign key constraints through Mongoose references
- Cascade operations for related data
- Data consistency maintenance

## 🔄 Data Flow Patterns

### **Order Processing**
1. Cart items → Order creation
2. Inventory quantity reduction
3. Payment status update
4. Delivery assignment

### **Appointment Workflow**
1. Appointment creation → Status tracking
2. Veterinarian assignment
3. Treatment record creation
4. Prescription generation

### **Inventory Management**
1. Supplier registration → Item addition
2. Stock level monitoring
3. Reorder point calculation
4. Release item tracking

---

*This database schema provides a robust foundation for managing complex veterinary and e-commerce operations with efficient data relationships and performance optimization.*
