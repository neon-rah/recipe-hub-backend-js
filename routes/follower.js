const express = require('express');
const router = express.Router();
const followerController = require('../controllers/followerController');
const { authenticateToken } = require('../middleware/auth');

router.post('/:followerId/follow/:followedId', authenticateToken, followerController.followUser);
router.delete('/:followerId/unfollow/:followedId', authenticateToken, followerController.unfollowUser);
router.get('/:followerId/is-following/:followedId', authenticateToken, followerController.isFollowing);
router.get('/:userId/followers', authenticateToken, followerController.getFollowers);
router.get('/:userId/following', authenticateToken, followerController.getFollowing);
router.get('/:userId/followers/count', authenticateToken, followerController.getFollowerCount);
router.get('/:userId/following/count', authenticateToken, followerController.getFollowingCount);
router.get('/:userId/suggestions', authenticateToken, followerController.getSuggestedUsers);
router.get('/:userId/random-suggestions', authenticateToken, followerController.getRandomSuggestedUsers);
router.get('/:userId/search', authenticateToken, followerController.searchUsers);

module.exports = router;