import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import moderationRoutes from './routes/moderationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ReLoop API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Feature API Routes
app.use('/api/items', itemRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
