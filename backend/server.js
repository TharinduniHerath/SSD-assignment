const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

// Import CSRF and cookie-parser
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/stripeRoutes");

const driverRoutes = require("./routes/driverRoutes");
const deliverRoutes = require('./routes/deliverRoutes');

const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const releaseItemsRoutes = require('./routes/releaseItemsRoutes');

const staffRoutes = require('./routes/staffRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const payrollRoutes = require('./routes/payrollRoutes');

const petRegisterRoutes = require('./routes/petRegisterRoutes');
const petTreatmentsRoutes = require('./routes/petTreatmentsRoutes');

const serviceRoutes = require('./routes/serviceRoutes');
const servicerecordsRoutes = require('./routes/servicerecordsRoutes');

const vetRoutes = require('./routes/vetRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicineRoutes = require('./routes/medicineRoutes');

const appointmentRoutes = require('./routes/appointmentRoutes');

const port = process.env.PORT || 4000;
const app = express();

// Enable CORS with credentials for frontend
app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parser
app.use(cookieParser());

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

// Route to provide CSRF token to frontend
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes (CSRF will be applied per route in router files for POST/PUT/DELETE)
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);

app.use("/api/drivers", driverRoutes);
app.use("/api/deliver-orders", deliverRoutes);

app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/release-items', releaseItemsRoutes);

app.use('/api/staff', staffRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);

app.use('/api/pets', petRegisterRoutes);
app.use('/api/treatments', petTreatmentsRoutes);

app.use('/api/services', serviceRoutes);
app.use('/api/servicerecords', servicerecordsRoutes);

app.use('/api/vets', vetRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medicines', medicineRoutes);

app.use('/api/appointments', appointmentRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to DB and start server
connectDB();
app.listen(port, () => console.log(`🚀 Server started on port ${port}`));
