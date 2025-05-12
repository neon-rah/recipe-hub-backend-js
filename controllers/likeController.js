const likeService = require('../services/likeService');

const likeController = {
    async toggleLike(req, res) {
        try {
            const like = await likeService.toggleLike(req.user.idUser, req.params.recipeId);
            res.status(like ? 201 : 200).json(like);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async deleteLike(req, res) {
        try {
            await likeService.deleteLike(req.user.idUser, req.params.recipeId);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async isLikedByUser(req, res) {
        const isLiked = await likeService.isLikedByUser(req.user.idUser, req.params.recipeId);
        res.json(isLiked);
    },

    async getLikesByRecipe(req, res) {
        const likes = await likeService.getLikesByRecipe(req.params.recipeId);
        res.json(likes);
    },

    async getLikesByUser(req, res) {
        const likes = await likeService.getLikesByUser(req.user.idUser);
        res.json(likes);
    },

    async getLikeCountByRecipe(req, res) {
        const count = await likeService.getLikeCountByRecipe(req.params.recipeId);
        res.json(count);
    },
};

module.exports = likeController;