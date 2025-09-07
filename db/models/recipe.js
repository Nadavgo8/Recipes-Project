"use strict";
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    "Recipe",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      title: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      ingredients: { type: DataTypes.JSON, allowNull: false }, // array<string>
      instructions: { type: DataTypes.JSON, allowNull: false }, // array<string>
      cookingTime: { type: DataTypes.FLOAT, allowNull: false },
      servings: { type: DataTypes.INTEGER, allowNull: false },
      difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        allowNull: false,
      },
      imageUrl: { type: DataTypes.STRING(255) },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "recipes",
    }
  );

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, { foreignKey: "userId" });
    Recipe.belongsToMany(models.User, {
      through: models.UserFavorite,
      foreignKey: "recipeId",
      otherKey: "userId",
      as: "likedBy",
    });
  };

  return Recipe;
};
