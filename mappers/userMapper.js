const userMapper = {
    toDto(user) {
        return {
            idUser: user.idUser,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            address: user.address,
            profilePic: user.profilePic,
            created: user.created,
            // recipes: recipes ? recipes.map(recipeMapper.toDto) : [], // Optionnel, décommenter si besoin
        };
    },

    toEntity(userDTO) {
        return {
            idUser: userDTO.idUser,
            lastName: userDTO.lastName,
            firstName: userDTO.firstName,
            email: userDTO.email,
            password: userDTO.password, // Attention : à hacher dans le service
            address: userDTO.address,
            profilePic: userDTO.profilePic,
            created: userDTO.created,
        };
    },
};

module.exports = userMapper;