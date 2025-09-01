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

// async function addNote(newNote) {
//   const notes = await getNotes();
//   newNote.id = nanoid(7);
//   newNote.date = new Date();
//   notes.push(newNote);
//   await fs.promises.writeFile("./data/notes.json", JSON.stringify(notes));
//   return newNote;
// }

module.exports = { getRecipes, getRecipeById };
