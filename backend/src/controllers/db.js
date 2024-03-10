const { Pool } = require('pg')

let pool = new Pool({
  // TODO change this after server is a container too
  connectionString: 'postgres://postgres:root@localhost:5432/recipe-app'
})

const helpers = {
  init: async function () {
    const q = 'CREATE TABLE IF NOT EXISTS temp(id SERIAL PRIMARY KEY, name VARCHAR(50), age INT)'
    const res = await pool.query(q)
  },

  getPeople: async function () {
    const res = await pool.query('SELECT * FROM temp')
    return res.rows
  },

  deleteById: async function (id) {
    const q = 'DELETE FROM petempople WHERE id = $1'
    const res = await pool.query(q, [id])
  },

  addPerson: async function (name, age) {
    const q = 'INSERT INTO temp(name, age) VALUES($1, $2)'
    const res = await pool.query(q, [name, age])
  },
}

module.exports = { helpers }