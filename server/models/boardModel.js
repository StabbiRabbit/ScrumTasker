const { Pool } = require('pg');

const PG_URI = 'postgres://qabkmpui:3XupXpFvW37F9LA0Yg9uQk09-LGp0fP_@peanut.db.elephantsql.com/qabkmpuik';

const pool = new Pool({
  connectionString: PG_URI
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback); 
  }
};
