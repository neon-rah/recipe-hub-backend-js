const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

router.post('/:userId', authenticateToken, notificationController.createNotification);
router.get('/:userId', authenticateToken, notificationController.getUserNotifications);
router.get('/:userId/unread', authenticateToken, notificationController.getUnreadCount);
router.put('/:userId/mark-all-read', authenticateToken, notificationController.markAllAsRead);
router.delete('/:notifId', authenticateToken, notificationController.deleteNotification);
router.delete('/user/:userId', authenticateToken, notificationController.deleteAllNotifications);
router.put('/:notifId/mark-read', authenticateToken, notificationController.markAsRead);
router.get('/notification/:notifId', authenticateToken, notificationController.getNotificationById);


router.put('/:userId/mark-all-seen', authenticateToken, notificationController.markAllAsSeen);
router.get('/:userId/unseen', authenticateToken, notificationController.getUnseenCount);

module.exports = router;