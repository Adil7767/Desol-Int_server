import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import carListingRoutes from './src/routes/carListing.js';
import authenticateToken from './src/middlewares/authMiddleware.js';
const app = express();

// Middleware for cors eror and 
app.use(cors());
app.use(express.json());
//connect mongo db
connectDB();


app.use('/auth', authRoutes);
app.use('/cars', authenticateToken, carListingRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Car Listing API');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
