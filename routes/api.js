const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const followerRoutes = require('./follower');
const likeRoutes = require('./like');
const notificationRoutes = require('./notification');
const recipeRoutes = require('./recipe');
const savedRecipeRoutes = require('./savedRecipe');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/followers', followerRoutes);
router.use('/likes', likeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/recipes', recipeRoutes);
router.use('/saved-recipes', savedRecipeRoutes);
router.use('/user', userRoutes);

module.exports = router;