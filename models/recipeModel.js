// const { randomUUID } = require("crypto");
// const fs = require("fs");
// const { nanoid } = require("nanoid");

// async function getRecipes() {
//   const data = await fs.promises.readFile("./data/recipes.json");
//   return JSON.parse(data);
// }

// async function getRecipeById(id) {
//   const recipes = await getRecipes();
//   const recipe = recipes.find((recipe) => recipe.id === id);
//   return recipe;
// }

// async function addRecipe(newRecipe) {
//   const recipes = await getRecipes();
//   newRecipe.id = randomUUID();
//   newRecipe.date = new Date();
//   recipes.push(newRecipe);
//   await fs.promises.writeFile("./data/recipes.json", JSON.stringify(recipes));
//   return newRecipe;
// }

// module.exports = { getRecipes, getRecipeById, addRecipe };

// models/recipeModel.js
const { randomUUID } = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "recipes.json");

async function readAll() {
  const text = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(text);
}

async function writeAll(list) {
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2) + "\n");
}

async function getRecipes() {
  return readAll();
}

async function getRecipeById(id) {
  const items = await readAll();
  return items.find((r) => String(r.id) === String(id)) || null;
}

async function addRecipe(newRecipe) {
  const items = await readAll();
  const recipe = {
    ...newRecipe,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  items.push(recipe);
  await writeAll(items);
  return recipe;
}

async function updateRecipe(id, patch) {
  const items = await readAll();
  const idx = items.findIndex((r) => String(r.id) === String(id));
  if (idx === -1) return null;

  const updated = {
    ...items[idx],
    ...patch,
    id: items[idx].id, // never change id
    updatedAt: new Date().toISOString(),
  };

  items[idx] = updated;
  await writeAll(items);
  return updated;
}

module.exports = { getRecipes, getRecipeById, addRecipe, updateRecipe };
