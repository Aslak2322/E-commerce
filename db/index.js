const pg = require('pg');
require('dotenv').config();
const { Pool } = pg;
 
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})
 
module.exports.query = (text, params) => {
  return pool.query(text, params)
};
