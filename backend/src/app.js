import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security and utility middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ComplaintHub REST API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      complaints: '/api/complaints',
      analytics: '/api/analytics/summary',
      settings: '/api/settings',
      notifications: '/api/notifications'
    }
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// Fallbacks
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
