const { Pool } = require("pg");
// Pool.defaults.ssl = true;
// pool.defaults.ssl = true;
const PG_URI =
  "postgres://wrmdwzxo:Bn58hLb-vWL3OzezKfySOSjo_VUweY0y@peanut.db.elephantsql.com/wrmdwzxo";

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
