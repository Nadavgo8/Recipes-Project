"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recipes", {
      // UUID PK (no DB-side default; Sequelize model should use DataTypes.UUIDV4)
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },

      // owner
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // core fields (match your validator)
      title: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      ingredients: { type: Sequelize.JSON, allowNull: false }, // array of strings
      instructions: { type: Sequelize.JSON, allowNull: false }, // array of strings

      cookingTime: { type: Sequelize.FLOAT, allowNull: false }, // minutes
      servings: { type: Sequelize.INTEGER, allowNull: false }, // >= 1
      difficulty: {
        type: Sequelize.ENUM("easy", "medium", "hard"),
        allowNull: false,
      },

      imageUrl: { type: Sequelize.STRING(255), allowNull: true },
      isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      // timestamps
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

    // helpful indexes
    await queryInterface.addIndex("recipes", ["userId"]);
    await queryInterface.addIndex("recipes", ["difficulty"]);
    await queryInterface.addIndex("recipes", ["title"]);
  },

  async down(queryInterface, Sequelize) {
    // drop indexes automatically when table drops, but enum needs cleanup first
    await queryInterface.removeIndex("recipes", ["title"]).catch(() => {});
    await queryInterface.removeIndex("recipes", ["difficulty"]).catch(() => {});
    await queryInterface.removeIndex("recipes", ["userId"]).catch(() => {});
    await queryInterface.dropTable("recipes");

    // MySQL keeps ENUM types per column, so no separate enum drop is needed
  },
};
