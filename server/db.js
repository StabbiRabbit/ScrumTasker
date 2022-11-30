const { Pool } = require("pg");
// Pool.defaults.ssl = true;
// pool.defaults.ssl = true;
const PG_URI = process.env.BACKEND_API_URI;

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
