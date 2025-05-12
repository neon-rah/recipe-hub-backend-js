const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticateToken } = require('../ LPCmiddleware/auth');

router.post('/recipe/:recipeId', authenticateToken, likeController.toggleLike);
router.delete('/recipe/:recipeId', authenticateToken, likeController.deleteLike);
router.get('/recipe/:recipeId', authenticateToken, likeController.isLikedByUser);
router.get('/recipe/:recipeId/list', authenticateToken, likeController.getLikesByRecipe);
router.get('/user', authenticateToken, likeController.getLikesByUser);
router.get('/recipe/:recipeId/count', authenticateToken, likeController.getLikeCountByRecipe);

module.exports = router;