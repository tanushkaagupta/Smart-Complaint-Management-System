import { Router } from 'express';
import complaintRoutes from './complaintRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ComplaintHub Backend API'
  });
});

router.use('/complaints', complaintRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/settings', settingsRoutes);
router.use('/notifications', notificationRoutes);

export default router;
