const { body, validationResult } = require("express-validator");

const recipeRules = [
  body("title").isString().trim().isLength({ min: 3, max: 100 }),
  body("description").isString().trim().isLength({ min: 10, max: 500 }),

  body("ingredients").isArray({ min: 1 }),
  body("ingredients.*").isString().trim().notEmpty(),

  body("instructions").isArray({ min: 1 }),
  body("instructions.*").isString().trim().notEmpty(),

  body("cookingTime").isFloat({ gt: 0 }).toFloat(), // positive number
  body("servings").isInt({ min: 1 }).toInt(), // positive integer
  body("difficulty").isIn(["easy", "medium", "hard"]),
];

function badRequest(message, details) {
  const err = new Error(message);
  err.status = 400;
  err.details = details;
  return err;
}

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return next(
    badRequest(
      "Invalid recipe data",
      result.array().map((e) => ({
        field: e.path,
        message: e.msg,
      }))
    )
  );
}

module.exports = { recipeRules, validate };
