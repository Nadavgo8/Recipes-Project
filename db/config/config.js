require("dotenv").config();
module.exports = {
  development: {
    url: process.env.DB_CONNECTION, // mysql://user:pass@host:3306/recipes_db
    dialect: "mysql",
    logging: false,
  },
};
