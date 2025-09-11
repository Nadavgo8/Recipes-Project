// smoke.js (place at project root)
require("dotenv").config();
const { sequelize, User, Recipe } = require("./db/models");

(async () => {
  try {
    // create a user
    const user = await User.create({
      username: "demo",
      email: "demo@example.com",
      password: "secret123", // whatever your model expects
    });

    // create a recipe linked to that user + include required fields
    const recipe = await Recipe.create({
      userId: user.id, // <-- REQUIRED FK
      title: "Pasta",
      description: "Yum",
      difficulty: "easy",
      cookingTime: 20,
      servings: 2,
      ingredients: ["pasta", "salt", "water"], // <-- REQUIRED
      instructions: [
        "Boil water",
        "Add pasta",
        "Cook for 10 minutes",
        "Drain and serve",
      ], // <-- REQUIRED
      isPublic: true,
    });

    console.log("Created user id:", user.id);
    console.log("Created recipe id:", recipe.id, "FK userId:", recipe.userId);

    // If you set up belongsToMany favorites/likes, you can also test it:
    // await user.addFavorite?.(recipe);     // if User.as === 'favorites'
    // const likedBy = await recipe.getLikedBy?.();  // if Recipe.as === 'likedBy'
    // console.log('likedBy:', likedBy?.map(u => u.username));
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
})();
