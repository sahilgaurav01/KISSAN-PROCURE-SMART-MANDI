const { db } = require('../config/database');

exports.getMyNotifications = (req, res) => {
  try {
    const notifications = db.prepare(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY id DESC 
      LIMIT 30
    `).all(req.user.id);

    const unreadCount = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0').get(req.user.id).count;

    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

exports.markAsRead = (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.id);
    } else {
      db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, req.user.id);
    }
    res.json({ success: true, message: 'Notifications updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
};
