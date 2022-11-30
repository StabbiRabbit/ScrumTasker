const { Pool } = require("pg");
// Pool.defaults.ssl = true;
// pool.defaults.ssl = true;
const PG_URI = process.env.PG_URI;

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
