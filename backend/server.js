import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import net from 'net';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

import { connectDB } from './lib/db.js';
import { addInitialProducts } from './controllers/product.controller.js';

// Load environment variables early
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050; // Default to 5050 if PORT is not defined

// Basic middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Add CORS middleware for frontend communication
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Utility to check if a port is in use
const isPortInUse = (port) => {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => {
        // Port is in use
        resolve(true);
      })
      .once('listening', () => {
        // Port is free
        tester.close();
        resolve(false);
      })
      .listen(port);
  });
};

// Find an available port
const findAvailablePort = async (startPort) => {
  let port = startPort;
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const inUse = await isPortInUse(port);
    
    if (!inUse) {
      return port;
    }
    
    console.log(`Port ${port} is in use, trying next port...`);
    port++;
  }
  
  throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
};

// Start server
const startServer = async () => {
  try {
    // Find an available port
    const availablePort = await findAvailablePort(PORT);
    
    if (availablePort !== PORT) {
      console.log(`Original port ${PORT} is in use, using port ${availablePort} instead`);
    }
    
    // Start the server on the available port
    const server = app.listen(availablePort, () => {
      console.log(`Server is running on port ${availablePort}`);
      
      // Connect to database after server starts
      connectDB()
        .then(() => {
          console.log('Database connected successfully');
          
          // Initialize products after DB connection
          try {
            addInitialProducts();
          } catch (error) {
            console.error('Error initializing products:', error.message);
          }
        })
        .catch(err => {
          console.error('Database connection error:', err.message);
        });
    });
    
    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err.message);
    });
    
    // Handle graceful shutdown
    const gracefulShutdown = () => {
      console.log('Received shutdown signal, closing server gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
      
      // Force close after timeout
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();