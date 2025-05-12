const { User, Follower } = require('../models');
const notificationService = require('./notificationService');

const followerService = {
    async followUser(followerId, followedId) {
        if (followerId === followedId) {
            throw new Error("You can't follow yourself");
        }

        const follower = await User.findByPk(followerId);
        const followed = await User.findByPk(followedId);
        if (!follower || !followed) {
            throw new Error('User not found');
        }

        const exists = await Follower.findOne({ where: { follower_id: followerId, followed_id: followedId } });
        if (exists) {
            throw new Error('Already following this user');
        }

        await Follower.create({ follower_id: followerId, followed_id: followedId });
        await notificationService.sendFollowNotification(followerId, followedId);
    },

    async unfollowUser(followerId, followedId) {
        const follow = await Follower.findOne({ where: { follower_id: followerId, followed_id: followedId } });
        if (!follow) {
            throw new Error('Not following this user');
        }
        await follow.destroy();
    },

    async isFollowing(followerId, followedId) {
        const follow = await Follower.findOne({ where: { follower_id: followerId, followed_id: followedId } });
        return !!follow;
    },

    async getFollowers(userId) {
        return Follower.findAll({ where: { followed_id: userId } });
    },

    async getFollowing(userId) {
        return Follower.findAll({ where: { follower_id: userId } });
    },

    async getFollowerCount(userId) {
        return Follower.count({ where: { followed_id: userId } });
    },

    async getFollowingCount(userId) {
        return Follower.count({ where: { follower_id: userId } });
    },

    async getSuggestedUsers(userId) {
        const following = await Follower.findAll({ where: { follower_id: userId }, attributes: ['followed_id'] });
        const followingIds = following.map(f => f.followed_id);
        return User.findAll({
            where: { idUser: { [require('sequelize').Op.notIn]: [userId, ...followingIds] } },
            order: [['lastName', 'ASC'], ['firstName', 'ASC']],
        });
    },

    async searchUsers(excludeUserId, query) {
        const { Op } = require('sequelize');
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { lastName: { [Op.iLike]: `%${query}%` } },
                    { firstName: { [Op.iLike]: `%${query}%` } },
                ],
                idUser: { [Op.ne]: excludeUserId },
            },
            order: [['lastName', 'ASC'], ['firstName', 'ASC']],
        });
        return users;
    },

    async getRandomSuggestedUsers(userId, limit) {
        const suggestedUsers = await this.getSuggestedUsers(userId);
        const shuffled = suggestedUsers.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    },
};

module.exports = followerService;