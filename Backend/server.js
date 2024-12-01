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

pool.getConnection()
  .then((connection) => {
    console.log('Connected to the database!');
    connection.release();
  })
  .catch((err) => {
    console.error('Database connection error: ', err);
  });


  app.get('/co2', async (req, res) => {
    try {
      // Correct the table name and column name
      const [rows] = await pool.query('SELECT value FROM co2_measurements');
      
      // Log the result to the console
      console.log('CO2 Data:', rows);  // Logs the query results
  
      res.json(rows);  // Send the data as the response
    } catch (error) {
      console.error('Error in fetching CO2 data:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Fetch users of a particular customer
// Fetch users of a particular customer
app.get('/users/:customer_id', async (req, res) => {
  const customerId = req.params.customer_id;

  try {
    // Use the connection pool to query the database
    const [results] = await pool.query('SELECT * FROM users WHERE customer_id = ?', [customerId]);

    if (results.length === 0) {
      return res.status(404).send('No users found for this customer');
    }

    // Return the list of users
    res.json(results);
  } catch (err) {
    console.error('Error fetching users:', err.stack);
    res.status(500).send('Error fetching users');
  }
});

// Fetch a single user by their id
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const [results] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    res.json(results[0]); // Return the single user object
  } catch (err) {
    console.error('Error fetching user by ID:', err.stack);
    res.status(500).send('Error fetching user');
  }
});


  // Check if the request body has at least one field to update
app.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, password_hash, role_id, customer_id } = req.body;

  // Check if the request body has at least one field to update
  if (!username && !email && !password_hash && !role_id && !customer_id) {
    return res.status(400).send('No fields to update');
  }

  try {
    const fields = [];
    const values = [];

    // Dynamically build the SQL query based on the provided fields
    if (username) {
      fields.push('username = ?');
      values.push(username);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (password_hash) {
      fields.push('password_hash = ?');
      values.push(password_hash);
    }
    if (role_id) {
      fields.push('role_id = ?');
      values.push(role_id);
    }
    if (customer_id) {
      fields.push('customer_id = ?');
      values.push(customer_id);
    }

    values.push(userId); // Add `id` to the values array for the WHERE clause

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.send('User updated successfully');
  } catch (err) {
    console.error('Error updating user:', err.stack);
    res.status(500).send('Error updating user');
  }
});

// Delete a user by ID
app.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Execute the DELETE query
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    // Check if any rows were affected (i.e., the user existed)
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    // Respond with success message
    res.send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error.stack);
    res.status(500).send('Error deleting user');
  }
});


// Add a new user
app.post('/user', async (req, res) => {
  const { username, email, password_hash, role_id, customer_id } = req.body;

  // Validate input
  if (!username || !email || !password_hash || !role_id || !customer_id) {
    return res.status(400).send('All fields are required: username, email, password_hash, role_id, customer_id');
  }

  try {
    // Insert the new user into the database
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, role_id, customer_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, password_hash, role_id, customer_id]
    );

    // Respond with the ID of the newly created user
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle duplicate key error (e.g., username or email already exists)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).send('Username or email already exists');
    }

    res.status(500).send('Error creating user');
  }
});




  
  



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
