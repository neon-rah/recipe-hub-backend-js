const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', userController.createUser);
router.get('/:id', authenticateToken, userController.findUserById);
router.get('/profile', authenticateToken, userController.getUserProfileFromToken);
router.get('/email/:email', authenticateToken, userController.findUserByEmail);
router.get('/', authenticateToken, userController.findAllUsers);
router.get('/exists/:email', authenticateToken, userController.existsUserByEmail);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.post('/:id/verify-password', authenticateToken, userController.verifyPassword);
router.put('/:id/change-password', authenticateToken, userController.changePassword);
router.get('/profile/:id', authenticateToken, userController.getUserProfile);

module.exports = router;