const recipeMapper = {
    toDto(recipe) {
        return {
            id: recipe.idRecipe,
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            preparation: recipe.preparation,
            category: recipe.category,
            image: recipe.image,
            creationDate: recipe.creationDate,
            updatedDate: recipe.updatedDate,
            userId: recipe.user_id,
            // user: user ? userMapper.toDto(user) : null, // Optionnel, décommenter si besoin
        };
    },

    toRecipeDTO(formDTO) {
        return {
            title: formDTO.title,
            description: formDTO.description,
            ingredients: formDTO.ingredients,
            preparation: formDTO.preparation,
            category: formDTO.category,
        };
    },

    toEntity(recipeDTO) {
        return {
            idRecipe: recipeDTO.id,
            title: recipeDTO.title,
            description: recipeDTO.description,
            ingredients: recipeDTO.ingredients,
            preparation: recipeDTO.preparation,
            category: recipeDTO.category,
            image: recipeDTO.image,
            creationDate: recipeDTO.creationDate,
            updatedDate: recipeDTO.updatedDate,
            user_id: recipeDTO.userId,
        };
    },
};

module.exports = recipeMapper;