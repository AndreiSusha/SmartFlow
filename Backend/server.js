import express from 'express'; // Use `import` for ES modules
import dotenv from 'dotenv'; // Use `import` for dotenv
import mysql from 'mysql2/promise'; // Use mysql2's `promise` import

dotenv.config();

const app = express();

// Middleware to parse JSON in request bodies
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Define routes
app.get('/notes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notes');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
