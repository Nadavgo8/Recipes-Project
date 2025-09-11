"use strict";
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Sequelize generates UUID client-side
      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: { len: [3, 30] },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false, // store the **hash** here
      },
      firstName: DataTypes.STRING(100),
      lastName: DataTypes.STRING(100),
    },
    {
      tableName: "users",
      // remove password when serializing to JSON (e.g., API responses)
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: { attributes: { include: ["password"] } }, // opt-in scope if you need to read the hash
      },
      hooks: {
        // hash on create/update if the value changed
        async beforeSave(user) {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  // handy helper to check a plaintext password
  User.prototype.verifyPassword = function (plain) {
    return bcrypt.compare(plain, this.password);
  };

  // define associations once other models exist
  User.associate = (models) => {
    User.hasMany(models.Recipe, { foreignKey: "userId" });
    User.belongsToMany(models.Recipe, {
      through: models.UserFavorite,
      foreignKey: "userId",
      otherKey: "recipeId",
      as: "favorites",
    });
  };

  return User;
};

