"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_favorites", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      recipeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "recipes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    // prevent duplicate favorites
    await queryInterface.addConstraint("user_favorites", {
      fields: ["userId", "recipeId"],
      type: "unique",
      name: "uq_user_favorite_user_recipe",
    });

    await queryInterface.addIndex("user_favorites", ["userId"]);
    await queryInterface.addIndex("user_favorites", ["recipeId"]);
  },

  async down(queryInterface) {
    await queryInterface
      .removeConstraint("user_favorites", "uq_user_favorite_user_recipe")
      .catch(() => {});
    await queryInterface
      .removeIndex("user_favorites", ["recipeId"])
      .catch(() => {});
    await queryInterface
      .removeIndex("user_favorites", ["userId"])
      .catch(() => {});
    await queryInterface.dropTable("user_favorites");
  },
};
