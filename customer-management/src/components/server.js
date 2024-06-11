// server.js
const express = require('express');
//const cors = require('cors');
//const bodyParser = require('body-parser');
const { Pool } = require('pg'); // For PostgreSQL

const app = express();
const port = 3306;

const pool = new Pool({
    host : "localhost",
    user : "root",
    password : "",
    database : "mobipoint",
    port:3306
});

// Fetch all customers
app.get('customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${3306}`);
});

app.post('/home/customer', async (req, res) => {
  try {
    console.log(req)
    //const result = await pool.query('SELECT * FROM customer');
    //res.json(result.rows);
    console.log(req)
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
