const { Pool } = require("pg");
// Pool.defaults.ssl = true;
// pool.defaults.ssl = true;
const PG_URI =
  "postgres://odgixfex:ltInvOjlEaG_uVNYSqG5-RSsO66VXryF@peanut.db.elephantsql.com/odgixfex";

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
