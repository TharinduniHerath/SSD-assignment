const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser"); // Add cookie-parser
//const { csrfProtection } = require("./controllers/csrfController");
//import csrf route
//const csrfRoutes = require("./routes/csrfRoutes");
// const {userdb} = require("./models/userModel");
 
const session = require("express-session");
const passport = require("passport");

 // Configure new Passport implementation
require('./config/passport')(passport);

// Import Security Configuration
//const securityConfig = require("./config/securityConfig");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/stripeRoutes");

const driverRoutes = require("./routes/driverRoutes");
const deliverRoutes = require("./routes/deliverRoutes");

const inventoryRoutes = require("./routes/inventoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const releaseItemsRoutes = require("./routes/releaseItemsRoutes");

//staff management
const staffRoutes = require("./routes/staffRoutes");
//leave management
const leaveRoutes = require("./routes/leaveRoutes");
//payroll management
const payrollRoutes = require("./routes/payrollRoutes");

//Pet Management
const petRegisterRoutes = require("./routes/petRegisterRoutes");
const petTreatmentsRoutes = require("./routes/petTreatmentsRoutes");

//service management
const serviceRoutes = require("./routes/serviceRoutes");
//service records management
const servicerecordsRoutes = require("./routes/servicerecordsRoutes");

//veterinary management
const vetRoutes = require("./routes/vetRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const medicineRoutes = require("./routes/medicineRoutes");

//appointment management
const appointmentRoutes = require("./routes/appointmentRoutes");

const port = process.env.PORT || 4000;

const app = express();

// Apply security configurations
//app.use(securityConfig());

// CSP violation reporting endpoint
// app.post("/report-csp-violations", express.json(), (req, res) => {
//   console.log("CSP Violation: ", req.body); // Log the CSP violation
//   res.status(204).end(); // Respond with no content
// });

// Configure CORS
// const corsOptions = {
//   origin: ['*'], // Replace with your frontend domains
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//   credentials: true // Allow cookies and other credentials
// };

 
app.use(
  cors({
    origin: "http://localhost:3000", // No trailing slash
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"], // Allow Authorization header
    credentials: true, // Allow cookies and credentials
  })
);

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Enable cookie-parser middleware

// Use CSRF routes
//app.use("/api/csrf", csrfRoutes);

// REPLACE the existing session configuration:
app.use(session({
  secret: process.env.SESSION_SECRET, // Use your new SESSION_SECRET
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());


// Apply CSRF protection to state-changing routes
// app.use(csrfProtection); // Protect all POST, PUT, DELETE routes

// OAuth routes
app.use('/auth', require('./routes/authRoutes'));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);

app.use("/api/drivers", driverRoutes);
app.use("/api/deliver-orders", deliverRoutes);

app.use("/api/inventory", inventoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/release-items", releaseItemsRoutes);

//staff management
app.use("/api/staff", staffRoutes);
//leave management
app.use("/api/leave", leaveRoutes);
//payroll management
app.use("/api/payroll", payrollRoutes);

//Pet Management
app.use("/api/pets", petRegisterRoutes);
app.use("/api/treatments", petTreatmentsRoutes);

//service management
app.use("/api/services", serviceRoutes);
//service records management
app.use("/api/servicerecords", servicerecordsRoutes);

//veterinary management
app.use("/api/vets", vetRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medicines", medicineRoutes);

//appointment management
app.use("/api/appointments", appointmentRoutes);

app.use(errorHandler);

connectDB();

app.listen(port, () => console.log(`🚀 Server started on port ${port}`));
