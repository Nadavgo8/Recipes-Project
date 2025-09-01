const recipeModel = require("../models/recipeModel.js");

async function getRecipes(req, res, next) {
  try {
    const { difficulty, maxCookingTime, search } = req.query;

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
    const all = await recipeModel.getRecipes();

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

async function getRecipeById(req, res, next) {
  try {
    const recipe = await recipeModel.getRecipeById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        error: true,
        message: "Unknown recipe id",
        statusCode: 404,
      });
    }
    return res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
}

async function addRecipe(req, res, next) {
  try {
    const created = await recipeModel.addRecipe(req.body);
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function updateRecipe(req, res, next) {
  try {
    const updated = await recipeModel.updateRecipe(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        error: true,
        message: "Unknown recipe id",
        statusCode: 404,
      });
    }
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}


async function deleteRecipe(req, res, next) {
  try {
    const deletedSuccessfuly = await recipeModel.deleteRecipe(req.params.id);
    if (!deletedSuccessfuly) {
      return res.status(404).json({
        error: true,
        message: "Unknown recipe id",
        statusCode: 404,
      });
    }
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

async function getRecipeStats(req, res, next) {
  try {
    const items = await recipeModel.getRecipes();

    const total = items.length;
    let sum = 0;
    const byDifficulty = { easy: 0, medium: 0, hard: 0 };

    for (const r of items) {
      sum += r.cookingTime;
      byDifficulty[r.difficulty] += 1;
    }

    const averageCookingTime = total ? +(sum / total).toFixed(2) : 0;

    return res.status(200).json({ total, averageCookingTime, byDifficulty });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeStats,
};
