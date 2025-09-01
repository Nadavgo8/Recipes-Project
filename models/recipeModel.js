const { randomUUID } = require("crypto");
const fs = require("fs");
const { nanoid } = require("nanoid");

async function getRecipes() {
  const data = await fs.promises.readFile("./data/recipes.json");
  return JSON.parse(data);
}

async function getRecipeById(id) {
  const recipes = await getRecipes();
  const recipe = recipes.find((recipe) => recipe.id === id);
  return recipe;
}

async function addRecipe(newRecipe) {
  const recipes = await getRecipes();
  newRecipe.id = randomUUID();
  newRecipe.date = new Date();
  recipes.push(newRecipe);
  await fs.promises.writeFile("./data/recipes.json", JSON.stringify(recipes));
  return newRecipe;
}

module.exports = { getRecipes, getRecipeById, addRecipe };
