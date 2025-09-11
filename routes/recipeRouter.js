const express = require("express");
const router = express.Router();

const {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
} = require("../controllers/recipeController");

// If upload uses default export:
const upload = require("../middlewares/upload");
// If auth exports { auth, sign }:
const { auth } = require("../middlewares/auth");
// If ownership exports { checkRecipeOwnership }:
const { checkRecipeOwnership } = require("../middlewares/ownership");

// Optional quick sanity logs (remove after):
// console.log('auth is', typeof auth, 'upload.single exists?', !!upload?.single, 'getMyRecipes is', typeof getMyRecipes);


const expectFn = (fn, name) => {
  if (typeof fn !== "function")
    throw new TypeError(`${name} must be a function`);
};
expectFn(auth, "auth");
expectFn(addRecipe, "addRecipe");
expectFn(updateRecipe, "updateRecipe");
expectFn(deleteRecipe, "deleteRecipe");
expectFn(getMyRecipes, "getMyRecipes");
if (!upload || typeof upload.single !== "function")
  throw new TypeError("upload.single must be a function");


router.post("/", auth, upload.single("image"), addRecipe);
router.put(
  "/:id",
  auth,
  checkRecipeOwnership,
  upload.single("image"),
  updateRecipe
);
router.delete("/:id", auth, checkRecipeOwnership, deleteRecipe);
router.get("/my-recipes", auth, getMyRecipes);

// You can also expose public list endpoints:
router.get("/", getRecipes);
router.get("/:id", getRecipeById);


// router.get("/", getRecipes);
// router.get("/:id", getRecipeById);
// router.post("/", recipeRules, validate, addRecipe);
// router.put("/:id", recipeRules, validate, updateRecipe);
// router.delete("/:id", deleteRecipe);

module.exports = router;
