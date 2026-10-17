import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getActivities
} from '../controllers/notificationController.js';

const router = Router();

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.get('/activities', getActivities);

export default router;
