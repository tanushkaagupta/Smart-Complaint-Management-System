import { storage } from '../db/storage.js';

export const getNotifications = (req, res) => {
  try {
    const notifications = storage.getNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      data: notifications
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: err.message
    });
  }
};

export const markAsRead = (req, res) => {
  try {
    const { id } = req.params;
    const success = storage.markNotificationAsRead(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: `Notification "${id}" not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: err.message
    });
  }
};

export const markAllAsRead = (req, res) => {
  try {
    storage.markAllNotificationsAsRead();
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: err.message
    });
  }
};

export const getActivities = (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const activities = storage.getActivities(limit);

    return res.status(200).json({
      success: true,
      data: activities
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve activity history',
      error: err.message
    });
  }
};
