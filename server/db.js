const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
// Not Sure What Pool.defaults.ssl is doing and if still needed
// Pool.defaults.ssl = true;
// pool.defaults.ssl = true;

const { PG_URI } = process.env;

const pool = new Pool({
  connectionString: PG_URI,
});


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
