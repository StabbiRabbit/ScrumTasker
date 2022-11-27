const { Pool } = require("pg");
// Pool.defaults.ssl = true;
// pool.defaults.ssl = true;
const PG_URI =
  "postgres://xmaxbtsd:45NctYrt51G93rnGbsdazdhl55JQqsq_@ziggy.db.elephantsql.com/xmaxbtsd";

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
