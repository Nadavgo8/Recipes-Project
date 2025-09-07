"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserFavorite = sequelize.define(
    "UserFavorite",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      recipeId: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: "user_favorites",
    }
  );

  UserFavorite.associate = (models) => {
    UserFavorite.belongsTo(models.User, { foreignKey: "userId" });
    UserFavorite.belongsTo(models.Recipe, { foreignKey: "recipeId" });
  };

  return UserFavorite;
};
