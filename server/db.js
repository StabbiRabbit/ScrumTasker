const { Pool } = require("pg");
// Pool.defaults.ssl = true;
// pool.defaults.ssl = true;
const PG_URI =
  "postgres://olmxijdc:4v8Khv60CibWCtGU5RjgR3_g84rE3khn@peanut.db.elephantsql.com/olmxijdc";

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
