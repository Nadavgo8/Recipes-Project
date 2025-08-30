const express = require("express");
// require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;
const recipeRouter = require("./routes/recipeRouter.js")
// const { logger } = require("./middlewares/logger.js");
// const { ValidationError } = require("ajv");

// Middleware that runs for every route
app.use(cors()); // adds CORS headers to every response
// app.use(logger);
app.use(express.json()); // parsing JSON to body
app.use(express.static("public")); // opens access to public folder

// Routes
app.use("/api/recipes", recipeRouter);

// Running the server
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});

// Home Route
app.get("/", (req, res) => {
  res.send("Hello Express!");
});


// Error Handling Middleware (always in the END)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});
