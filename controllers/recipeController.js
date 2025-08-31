// controllers/recipeController.js
const recipeModel = require("../models/recipeModel.js");

async function getRecipes(req, res, next) {
  try {
    const { difficulty, maxCookingTime, search } = req.query;

    // validate difficulty (optional)
    const allowed = ["easy", "medium", "hard"];
    let diff;
    if (difficulty) {
      diff = String(difficulty).toLowerCase().trim();
      if (!allowed.includes(diff)) {
        return res
          .status(400)
          .json({ error: "Invalid 'difficulty'. Use: easy | medium | hard" });
      }
    }

    // validate maxCookingTime (optional)
    let maxTime;
    if (maxCookingTime !== undefined) {
      maxTime = Number(maxCookingTime);
      if (!Number.isFinite(maxTime) || maxTime < 0) {
        return res
          .status(400)
          .json({ error: "'maxCookingTime' must be a non-negative number" });
      }
    }

    const q = (search || "").toString().trim().toLowerCase();

    // load all recipes
    const all = await recipeModel.getRecipes();

    // apply filters
    const filtered = all.filter((r) => {
      if (diff && String(r.difficulty).toLowerCase() !== diff) return false;
      if (maxTime !== undefined && Number(r.cookingTime) > maxTime)
        return false;
      if (q) {
        const title = (r.title || "").toLowerCase();
        const desc = (r.description || "").toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    });

    return res.status(200).json(filtered);
  } catch (err) {
    next(err);
  }
}

module.exports = { getRecipes };

// async function getNotes(req, res) {
//   const notes = await noteModel.getNotes();
//   res.status(200).json(notes);
// }

// async function getNoteById(req, res) {
//   const note = await noteModel.getNoteById(req.params.id);
//   note
//     ? res.status(200).json(note)
//     : res.status(404).json({ error: "Unknown note id" });
// }

// async function addNote(req, res) {
//   const newNote = await noteModel.addNote(req.body);
//   res.status(201).json(newNote);
// }
