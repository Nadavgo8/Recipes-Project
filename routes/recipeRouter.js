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
router.put("/:id", recipeRules, validate, updateRecipe);

module.exports = router;
