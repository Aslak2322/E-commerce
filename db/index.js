const pg = require('pg');
require('dotenv').config();
const { Pool } = pg;
 
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // This allows the connection to Render's PostgreSQL service.
    }
});
 
module.exports.query = (text, params) => {
  return pool.query(text, params)
};
