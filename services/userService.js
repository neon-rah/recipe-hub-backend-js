const bcrypt = require('bcrypt');
const { User, Recipe } = require('../models');
const fileStorageService = require('./fileStorage');
const { extractEmail } = require('../middleware/auth');
const userMapper = require('../mappers/userMapper');

const userService = {
    async createUser(userData, profileImage) {
        const { email, password } = userData;
        if (await User.findOne({ where: { email } })) {
            throw new Error('Email address already in use');
        }

        const profilePic = profileImage && profileImage.size > 0
            ? await fileStorageService.storeFile(profileImage, 'user', null)
            : null;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ ...userData, password: hashedPassword, profilePic });
        return userMapper.toDTO(user);
    },

    async getUserProfileFromToken(token) {
        const email = extractEmail(token);
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('User not found');
        return userMapper.toDTO(user);
    },

    async findUserById(userId) {
        const user = await User.findByPk(userId);
        return user ? userMapper.toDTO(user) : null;
    },

    async findUserByEmail(email) {
        const user = await User.findOne({ where: { email } });
        return user ? userMapper.toDTO(user) : null;
    },

    async findAllUsers() {
        const users = await User.findAll();
        return users.map(u => userMapper.toDTO(u));
    },

    async existsUserByEmail(email) {
        return !!(await User.findOne({ where: { email } }));
    },

    async updateUser(userId, updatedUserData, newProfileImage) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        if (newProfileImage && newProfileImage.size > 0) {
            updatedUserData.profilePic = await fileStorageService.storeFile(newProfileImage, 'user', user.profilePic);
        }

        await user.update(updatedUserData);
        return userMapper.toDTO(user);
    },

    async deleteUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');
        if (user.profilePic) await fileStorageService.deleteFile(user.profilePic);
        await user.destroy();
    },

    async verifyPassword(userId, password) {
        const user = await User.findByPk(userId);
        return user ? await bcrypt.compare(password, user.password) : false;
    },

    async changePassword(userId, newPassword) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
    },

    async getUserProfile(userId) {
        const user = await User.findByPk(userId, {
            include: [{ model: Recipe, as: 'recipes' }],
        });
        return user ? userMapper.toDTO(user, true) : null;
    },

    toDTO(user, includeRecipes = false) {
        const dto = {
            idUser: user.idUser,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            address: user.address,
            profilePic: user.profilePic,
            created: user.created,
        };
        if (includeRecipes && user.recipes) {
            dto.recipes = user.recipes.map(r => recipeService.toDTO(r));
        }
        return dto;
    },
};

module.exports = userService;