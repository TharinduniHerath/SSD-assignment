const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/stripeRoutes");

const driverRoutes = require("./routes/driverRoutes");
const deliverRoutes = require('./routes/deliverRoutes');

const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const releaseItemsRoutes = require('./routes/releaseItemsRoutes')

//staff management
const staffRoutes = require('./routes/staffRoutes')
//leave management
const leaveRoutes = require('./routes/leaveRoutes')
//payroll management
const payrollRoutes = require('./routes/payrollRoutes')

//Pet Management
const petRegisterRoutes= require('./routes/petRegisterRoutes')
const petTreatmentsRoutes= require('./routes/petTreatmentsRoutes')

//service management
const serviceRoutes = require('./routes/serviceRoutes')
//service records management
const servicerecordsRoutes = require('./routes/servicerecordsRoutes')

//veterinary management
const vetRoutes  = require('./routes/vetRoutes')
const prescriptionRoutes  = require('./routes/prescriptionRoutes')
const medicineRoutes  = require('./routes/medicineRoutes')

//appointment management
const appointmentRoutes  = require('./routes/appointmentRoutes')

//file upload management
const uploadRoutes = require('./routes/uploadRoutes')

const port = process.env.PORT || 4000;

const app = express();

// Security Headers Configuration using Helmet
app.use(helmet({
  // Remove X-Powered-By header
  hidePoweredBy: true,
  
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  
  // Prevent clickjacking
  frameguard: { action: 'deny' },
  
  // XSS protection
  xssFilter: true,
  
  // Prevent MIME type sniffing
  noSniff: true,
  
  // Force HTTPS in production
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration - Restrict to trusted domains only
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);

app.use("/api/drivers", driverRoutes);
app.use("/api/deliver-orders", deliverRoutes);

app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/release-items',releaseItemsRoutes)

//staff management
app.use('/api/staff', staffRoutes);
//leave management
app.use('/api/leave', leaveRoutes);
//payroll management
app.use('/api/payroll', payrollRoutes);

//Pet Management
app.use('/api/pets', petRegisterRoutes);
app.use('/api/treatments', petTreatmentsRoutes);

//service management
app.use('/api/services', serviceRoutes);
//service records management
app.use('/api/servicerecords', servicerecordsRoutes);

//veterinary management
app.use('/api/vets', vetRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medicines', medicineRoutes);

//appointment management
app.use('/api/appointments', appointmentRoutes);

//file upload management
app.use('/api/files', uploadRoutes);

app.use(errorHandler);

connectDB();

// SSL/TLS Configuration
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

// Create HTTPS server
const server = https.createServer(sslOptions, app);

server.listen(port, () => {
  console.log(`🚀 HTTPS Server started on port ${port}`.green);
  console.log(`🔒 SSL/TLS encryption enabled`.cyan);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});