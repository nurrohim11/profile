const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'profile',
  password: 'programmer11',
  port: 5432,
})

module.exports = pool