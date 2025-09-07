const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;
const recipeRouter = require("./routes/recipeRouter.js")
const morgan = require("morgan"); // ⬅ add
const { sequelize } = require("./db/models"); // This connects to DB

morgan.token("timestamp", () => new Date().toISOString());
app.use(
  morgan(
    ":timestamp :method :url :status :res[content-length] - :response-time ms"
  )
);

// Middleware that runs for every route
app.use(cors()); // adds CORS headers to every response
// app.use(logger);
app.use(express.json()); // parsing JSON to body
app.use(express.static("public")); // opens access to public folder

// Routes
app.use("/api/recipes", recipeRouter);

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
  }
}
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await testConnection();
});

// // Running the server
// app.listen(PORT, () => {
//   console.log("Server is listening on port " + PORT);
// });

// Home Route
app.get("/", async (req, res) => {
  const [results, metadata] = await sequelize.query(
    "SELECT * FROM test_connection"
  );
  console.log(results);
  res.send("Hello Express!");
});

app.use((req, res) => {
  res.status(404).json({ error: true, message: "Not Found", statusCode: 404 });
});
// Error Handling Middleware (always in the END)
app.use((err, req, res, next) => {
  const status = Number(err.status || err.statusCode || 500);
  const message = err.message || "Internal Server Error";
  // log the full error (stack etc.)
  console.error(err);
  res.status(status).json({ error: true, message, statusCode: status });
});

