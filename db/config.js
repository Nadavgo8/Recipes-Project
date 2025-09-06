require("dotenv").config(); // Load .env into process.env

module.exports = {
  development: {
    use_env_variable: "DB_CONNECTION",
    dialect: "mysql",
  },
  test: {
    use_env_variable: "DB_CONNECTION",
    dialect: "mysql",
  },
  production: {
    use_env_variable: "DB_CONNECTION",
    dialect: "mysql",
  },
};
