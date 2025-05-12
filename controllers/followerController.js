const followerService = require('../services/followerService');

const followerController = {
    async followUser(req, res) {
        try {
            await followerService.followUser(req.params.followerId, req.params.followedId);
            res.status(201).json({ message: 'User followed successfully' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async unfollowUser(req, res) {
        try {
            await followerService.unfollowUser(req.params.followerId, req.params.followedId);
            res.json({ message: 'User unfollowed successfully' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async isFollowing(req, res) {
        const isFollowing = await followerService.isFollowing(req.params.followerId, req.params.followedId);
        res.json(isFollowing);
    },

    async getFollowers(req, res) {
        const followers = await followerService.getFollowers(req.params.userId);
        res.json(followers);
    },

    async getFollowing(req, res) {
        const following = await followerService.getFollowing(req.params.userId);
        res.json(following);
    },

    async getFollowerCount(req, res) {
        const count = await followerService.getFollowerCount(req.params.userId);
        res.json(count);
    },

    async getFollowingCount(req, res) {
        const count = await followerService.getFollowingCount(req.params.userId);
        res.json(count);
    },

    async getSuggestedUsers(req, res) {
        const suggestions = await followerService.getSuggestedUsers(req.params.userId);
        res.json(suggestions);
    },

    async getRandomSuggestedUsers(req, res) {
        const suggestions = await followerService.getRandomSuggestedUsers(req.params.userId, 10);
        res.json(suggestions);
    },

    async searchUsers(req, res) {
        const { query } = req.query;
        if (!query) return res.status(400).json({ error: 'Query parameter is required' });
        const users = await followerService.searchUsers(req.params.userId, query);
        res.json(users);
    },
};

module.exports = followerController;