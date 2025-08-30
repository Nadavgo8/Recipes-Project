const express = require("express");
const router = express.Router();
const {getRecipes} = require("../controllers/recipeController")


router.get("/", getRecipes);
// router.get("api/recipes/:id");
// router.post("api/recipes");
// router.put("api/recipes/:id");
// router.delete("api/recipes/:id");
// router.get("api/recipes/stats");




module.exports  = router;