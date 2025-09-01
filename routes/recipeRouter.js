// const express = require("express");
// const router = express.Router();
// const {
//   getRecipes,
//   getRecipeById,
//   addRecipe,
// } = require("../controllers/recipeController");
// const { recipeRules, validate } = require("../middlewares/recipeValidator");

// router.get("/", getRecipes);
// router.get("/:id", getRecipeById);
// router.post("/", recipeRules, validate, addRecipe);
// // router.put("api/recipes/:id");
// // router.delete("api/recipes/:id");
// // router.get("api/recipes/stats");

// module.exports  = router;

// routes/recipeRouter.js
const express = require("express");
const router = express.Router();

const {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
} = require("../controllers/recipeController");
const { recipeRules, validate } = require("../middlewares/recipeValidator");

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", recipeRules, validate, addRecipe);
router.put("/:id", recipeRules, validate, updateRecipe); // ← add this

module.exports = router;
