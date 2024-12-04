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
  
 // API endpoint to see the assets
 app.get('/api/assets', async (req, res) => {
  const query = `
    SELECT 
      l.id AS location_id,
      l.country,
      l.city,
      l.address,
      a.name AS asset_name,
      COUNT(DISTINCT ua.user_id) AS users_assigned
    FROM locations l
    LEFT JOIN assets a ON l.id = a.location_id
    LEFT JOIN user_assets ua ON a.id = ua.asset_id
    GROUP BY l.id, l.country, l.city, l.address, a.name;
  `;

  try {
    const [results] = await pool.query(query); // Execute the query

    const formattedResults = results.map(row => ({
      location: {
        id: row.location_id,
        name: `${row.country}, ${row.city}`, // Format country and city
        address: row.address,
      },
      asset: {
        name: row.asset_name, // Asset name
      },
      usersAssigned: row.users_assigned,
    }));

    res.json(formattedResults); // Send the formatted response
  } catch (err) {
    console.error('Error fetching locations data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



// API endpoint for the asset type
app.get('/api/asset-types', async (req, res) => {
  const query = `
    SELECT id, type_name
    FROM asset_types
  `;

  try {
    const [results] = await pool.query(query); // Query the asset_types table
    res.json(results); // Send the results as JSON
  } catch (err) {
    console.error('Error fetching asset types:', err);
    res.status(500).json({ error: 'Failed to fetch asset types' });
  }
});

// API endpoint to add new asset
app.post('/api/add-new-asset', async (req, res) => {
  const {
    assetName,
    assetTypeName, 
    location: {
      country,
      city,
      address,
      zipCode,
      additionalInformation
    }
  } = req.body;

  // Validate required fields
  if (!assetName || !assetTypeName || !country || !city) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Retrieve the asset type ID based on the asset type name
    const assetTypeQuery = `
      SELECT id FROM asset_types WHERE type_name = ?
    `;
    const [assetTypeResult] = await connection.query(assetTypeQuery, [assetTypeName]);

    if (assetTypeResult.length === 0) {
      throw new Error(`Asset type '${assetTypeName}' not found`);
    }

    const assetTypeId = assetTypeResult[0].id;

    // Insert the new location
    const locationQuery = `
      INSERT INTO locations (country, city, address, zip_code, additional_information, customer_id)
      VALUES (?, ?, ?, ?, ?, 3) -- Replace '3' with the appropriate customer_id if dynamic
    `;
    const [locationResult] = await connection.query(locationQuery, [
      country,
      city,
      address || null, // Allow null values for optional fields
      zipCode || null,
      additionalInformation || null
    ]);

    const newLocationId = locationResult.insertId; // Get the ID of the inserted location

    // Insert the new asset
    const assetQuery = `
      INSERT INTO assets (name, asset_type_id, location_id, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const [assetResult] = await connection.query(assetQuery, [
      assetName,
      assetTypeId,
      newLocationId
    ]);

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      message: 'Asset and location added successfully',
      assetId: assetResult.insertId,
      locationId: newLocationId
    });
  } catch (err) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    console.error('Error adding asset and location:', err);
    res.status(500).json({ error: 'Failed to add asset and location' });
  } finally {
    connection.release(); // Release the connection
  }
});


// API endpoint for assset details 
app.get('/api/asset-details/:id', async (req, res) => {
  const assetId = req.params.id;

  try {
    // Query to fetch asset details
    const assetQuery = `
      SELECT 
        a.name AS asset_name,
        a.id AS building_id,
        l.address,
        l.city,
        l.country,
        a.description,
        CONCAT('+1 (555) 123-4567', ', ', '+1 (555) 125-4561') AS contact_info -- Hardcoded for now
      FROM assets a
      LEFT JOIN locations l ON a.location_id = l.id
      WHERE a.id = ?
    `;
    const [assetResults] = await pool.query(assetQuery, [assetId]);

    if (assetResults.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const assetDetails = assetResults[0];

    // Query to fetch users assigned to the asset
    const userQuery = `
      SELECT 
        u.id AS user_id,
        u.username AS user_name,
        u.email AS user_email
      FROM user_assets ua
      LEFT JOIN users u ON ua.user_id = u.id
      LEFT JOIN assets a ON ua.asset_id = a.id
      WHERE a.id = ?
    `;
    const [userResults] = await pool.query(userQuery, [assetId]);

    // Combine asset details and user list
    res.json({
      ...assetDetails,
      users: userResults
    });
  } catch (err) {
    console.error('Error fetching asset details and users:', err);
    res.status(500).json({ error: 'Failed to fetch asset details and users' });
  }
});


// API endpoint to see user details based on ID
app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const userQuery = `
      SELECT 
        u.username AS user_name,
        u.email AS user_email,
        u.phone_number AS phone_number,
        u.user_summary AS user_summary,
        u.last_active AS last_active,
        GROUP_CONCAT(a.name) AS assigned_assets
      FROM users u
      LEFT JOIN user_assets ua ON u.id = ua.user_id
      LEFT JOIN assets a ON ua.asset_id = a.id
      WHERE u.id = ?
      GROUP BY u.id;
    `;

    const [userDetails] = await pool.query(userQuery, [userId]);

    if (userDetails.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the raw data directly
    res.json(userDetails[0]);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});





// API endpoint to edit asset details
app.put('/api/asset/:id', async (req, res) => {
  const assetId = req.params.id; // Use asset_id from the URL
  const { name, address, description } = req.body;

  let connection;

  try {
    // Initialize variables for dynamic query building
    const locationFieldsToUpdate = [];
    const locationValues = [];
    const assetFieldsToUpdate = [];
    const assetValues = [];

    // Check for each field and add it to the update query if provided
    if (address) {
      locationFieldsToUpdate.push('address = ?');
      locationValues.push(address);
    }

    if (name) {
      assetFieldsToUpdate.push('name = ?');
      assetValues.push(name);
    }

    if (description) {
      assetFieldsToUpdate.push('description = ?');
      assetValues.push(description);
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Update the `locations` table if address is provided
    if (locationFieldsToUpdate.length > 0) {
      const locationQuery = `
        UPDATE locations
        SET ${locationFieldsToUpdate.join(', ')}
        WHERE id = (SELECT location_id FROM assets WHERE id = ?)
      `;
      locationValues.push(assetId); // Use `asset_id` to find the associated location
      const [locationResult] = await connection.query(locationQuery, locationValues);

      if (locationResult.affectedRows === 0) {
        console.warn('No associated location found for the given asset. Skipping location update.');
      }
    }

    // Update the `assets` table if name or description is provided
    if (assetFieldsToUpdate.length > 0) {
      const assetQuery = `
        UPDATE assets
        SET ${assetFieldsToUpdate.join(', ')}
        WHERE id = ?
      `;
      assetValues.push(assetId); // Use `asset_id` to update the asset
      const [assetResult] = await connection.query(assetQuery, assetValues);

      if (assetResult.affectedRows === 0) {
        throw new Error('Asset not found');
      }
    }

    // Commit the transaction
    await connection.commit();
    res.json({ message: 'Asset details updated successfully' });

  } catch (err) {
    if (connection) await connection.rollback(); // Rollback transaction in case of error
    console.error('Error updating asset details:', err);
    res.status(500).json({ error: 'Failed to update asset details', details: err.message });
  } finally {
    if (connection) {
      connection.release(); // Release the database connection
    }
  }
});



// API endpoint to delete an asset
app.delete('/api/assets/:id', async (req, res) => {
  const assetId = req.params.id;

  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Delete related data from asset_measurements
    const deleteAssetMeasurementsQuery = `
      DELETE FROM asset_measurements WHERE asset_id = ?
    `;
    await connection.query(deleteAssetMeasurementsQuery, [assetId]);

    // Delete related data from user_assets
    const deleteUserAssetsQuery = `
      DELETE FROM user_assets WHERE asset_id = ?
    `;
    await connection.query(deleteUserAssetsQuery, [assetId]);

    // Finally, delete the asset itself
    const deleteAssetQuery = `
      DELETE FROM assets WHERE id = ?
    `;
    const [result] = await connection.query(deleteAssetQuery, [assetId]);

    if (result.affectedRows === 0) {
      throw new Error('Asset not found');
    }

    // Commit the transaction
    await connection.commit();

    res.json({ message: 'Asset and all related records deleted successfully' });
  } catch (err) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    console.error('Error deleting asset:', err);
    res.status(500).json({ error: 'Failed to delete asset' });
  } finally {
    connection.release(); // Release the database connection
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