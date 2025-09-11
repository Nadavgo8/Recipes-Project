// const recipeModel = require("../models/recipeModel.js");

// async function getRecipes(req, res, next) {
//   try {
//     const { difficulty, maxCookingTime, search } = req.query;

//     const allowed = ["easy", "medium", "hard"];
//     let diff;
//     if (difficulty) {
//       diff = String(difficulty).toLowerCase().trim();
//       if (!allowed.includes(diff)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid 'difficulty'. Use: easy | medium | hard" });
//       }
//     }

//     let maxTime;
//     if (maxCookingTime !== undefined) {
//       maxTime = Number(maxCookingTime);
//       if (!Number.isFinite(maxTime) || maxTime < 0) {
//         return res
//           .status(400)
//           .json({ error: "'maxCookingTime' must be a non-negative number" });
//       }
//     }

//     const q = (search || "").toString().trim().toLowerCase();
//     const all = await recipeModel.getRecipes();

//     const filtered = all.filter((r) => {
//       if (diff && String(r.difficulty).toLowerCase() !== diff) return false;
//       if (maxTime !== undefined && Number(r.cookingTime) > maxTime)
//         return false;
//       if (q) {
//         const title = (r.title || "").toLowerCase();
//         const desc = (r.description || "").toLowerCase();
//         if (!title.includes(q) && !desc.includes(q)) return false;
//       }
//       return true;
//     });

//     return res.status(200).json(filtered);
//   } catch (err) {
//     next(err);
//   }
// }

// async function getRecipeById(req, res, next) {
//   try {
//     const recipe = await recipeModel.getRecipeById(req.params.id);
//     if (!recipe) {
//       return res.status(404).json({
//         error: true,
//         message: "Unknown recipe id",
//         statusCode: 404,
//       });
//     }
//     return res.status(200).json(recipe);
//   } catch (err) {
//     next(err);
//   }
// }

// async function addRecipe(req, res, next) {
//   try {
//     const created = await recipeModel.addRecipe(req.body);
//     return res.status(201).json(created);
//   } catch (err) {
//     next(err);
//   }
// }

// async function updateRecipe(req, res, next) {
//   try {
//     const updated = await recipeModel.updateRecipe(req.params.id, req.body);
//     if (!updated) {
//       return res.status(404).json({
//         error: true,
//         message: "Unknown recipe id",
//         statusCode: 404,
//       });
//     }
//     return res.status(200).json(updated);
//   } catch (err) {
//     next(err);
//   }
// }

// async function deleteRecipe(req, res, next) {
//   try {
//     const deletedSuccessfuly = await recipeModel.deleteRecipe(req.params.id);
//     if (!deletedSuccessfuly) {
//       return res.status(404).json({
//         error: true,
//         message: "Unknown recipe id",
//         statusCode: 404,
//       });
//     }
//     return res.status(204).end();
//   } catch (err) {
//     return next(err);
//   }
// }

// async function getRecipeStats(req, res, next) {
//   try {
//     const items = await recipeModel.getRecipes();

//     const total = items.length;
//     let sum = 0;
//     const byDifficulty = { easy: 0, medium: 0, hard: 0 };

//     for (const r of items) {
//       sum += r.cookingTime;
//       byDifficulty[r.difficulty] += 1;
//     }

//     const averageCookingTime = total ? +(sum / total).toFixed(2) : 0;

//     return res.status(200).json({ total, averageCookingTime, byDifficulty });
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = {
//   getRecipes,
//   getRecipeById,
//   addRecipe,
//   updateRecipe,
//   deleteRecipe,
//   getRecipeStats,
// };

// controllers/recipeController.js
const { Recipe, User } = require("../db/models");

async function getRecipes(req, res, next) {
  try {
    const { difficulty, maxCookingTime, search } = req.query;
    const where = {};
    if (difficulty) where.difficulty = difficulty.toLowerCase();
    if (maxCookingTime) where.cookingTime = { $lte: Number(maxCookingTime) };
    if (search) where.title = { $like: `%${search}%` }; // or Op.iLike/Op.substring

    const rows = await Recipe.findAll({
      where,
      include: [{ model: User, as: "author", attributes: ["id", "username"] }],
    });
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

async function getRecipeById(req, res, next) {
  try {
    const r = await Recipe.findByPk(req.params.id, {
      include: [
        { model: User, as: "author", attributes: ["id", "username"] },
        {
          model: User,
          as: "likedBy",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
      ],
    });
    if (!r) return res.status(404).json({ message: "Unknown recipe id" });
    res.json(r);
  } catch (e) {
    next(e);
  }
}

async function addRecipe(req, res, next) {
  try {
    const payload = { ...req.body, userId: req.user.id };
    if (req.file) payload.imageUrl = `/uploads/recipes/${req.file.filename}`;
    const created = await Recipe.create(payload);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

async function updateRecipe(req, res, next) {
  try {
    const r = await Recipe.findByPk(req.params.id);
    if (!r) return res.status(404).json({ message: "Unknown recipe id" });
    if (r.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    if (req.file) req.body.imageUrl = `/uploads/recipes/${req.file.filename}`;
    await r.update(req.body);
    res.json(r);
  } catch (e) {
    next(e);
  }
}

async function deleteRecipe(req, res, next) {
  try {
    const r = await Recipe.findByPk(req.params.id);
    if (!r) return res.status(404).json({ message: "Unknown recipe id" });
    if (r.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    await r.destroy();
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
};
