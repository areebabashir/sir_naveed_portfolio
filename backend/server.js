import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Importing routes
import blogRoutes from './routes/blogRoutes.js'; // Importing blog routes
import serviceRoutes from './routes/serviceRoutes.js'; // Importing service routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: '50mb' })); // Parse incoming JSON requests with 50MB limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded data
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Routes
app.use('/api/auth', authRoutes); // Mount auth routes
app.use('/api/blog', blogRoutes); // Mount blog routes
app.use('/api/services', serviceRoutes); // Mount service routes

// Basic route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the E-commerce App</h1>');
});

// Set the PORT from environment variables or default to 8000
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
