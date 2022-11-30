const { Pool } = require("pg");
const dotenv = require("dotenv")
dotenv.config()

const PG_URI = process.env.PG_URI;
console.log('PG_URI', PG_URI);
const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
