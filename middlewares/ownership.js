const { Recipe } = require("../db/models");
async function checkRecipeOwnership(req, res, next) {
  const recipe = await Recipe.findByPk(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });
  if (recipe.userId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });
  req.recipe = recipe;
  next();
}
module.exports = { checkRecipeOwnership };
