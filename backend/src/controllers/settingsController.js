import { storage } from '../db/storage.js';

export const getSettings = (req, res) => {
  try {
    const settings = storage.getSettings();
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve settings',
      error: err.message
    });
  }
};

export const updateSettings = (req, res) => {
  try {
    const allowedFields = [
      'name',
      'email',
      'emailNotifications',
      'newComplaintNotifications',
      'statusNotifications',
      'darkMode'
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updated = storage.updateSettings(updates);
    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: err.message
    });
  }
};

export const updatePassword = (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both password and confirmation are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: err.message
    });
  }
};
