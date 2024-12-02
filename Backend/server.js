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

  app.get('/humidity', async (req, res) => {
    try {
      // Correct the table name and column name
      const [rows] = await pool.query('SELECT * FROM humidity_measurements');
      
      // Log the result to the console
      console.log('CO2 Data:', rows);  // Logs the query results
  
      res.json(rows);  // Send the data as the response
    } catch (error) {
      console.error('Error in fetching humidity data:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
 // API endpoint to add location data
 app.get('/api/add-locations', async (req, res) => {
  const query = `
    SELECT 
      l.id AS location_id,
      l.country,
      l.city,
      l.address,
      COUNT(DISTINCT ua.user_id) AS users_assigned
    FROM locations l
    LEFT JOIN assets a ON l.id = a.location_id
    LEFT JOIN user_assets ua ON a.id = ua.asset_id
    GROUP BY l.id, l.country, l.city, l.address;
  `;

  try {
    const [results] = await pool.query(query); // Execute the query

    const formattedResults = results.map(row => ({
      id: row.location_id,
      name: `${row.country}, ${row.city}`, // Format country and city
      address: row.address,
      usersAssigned: row.users_assigned
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

// API endpoint to see user based on ID
app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Query to fetch user details
    const userQuery = `
      SELECT 
        u.username AS user_name,
        u.email AS user_email,
        CONCAT('+1-234-567-8900') AS phone_number, -- Placeholder phone number
        r.role_name AS role_name, -- Assuming role names are stored in a 'roles' table
        u.created_at AS created_at, 
        c.name AS customer_name, -- Assuming customers table stores customer details
        a.name AS assigned_location
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN customers c ON u.customer_id = c.id
      LEFT JOIN user_assets ua ON u.id = ua.user_id
      LEFT JOIN assets a ON ua.asset_id = a.id
      WHERE u.id = ?;
    `;

    const [userDetails] = await pool.query(userQuery, [userId]);

    if (userDetails.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with user details
    res.json(userDetails[0]);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});


// API endpoint to edit location  
app.put('/api/locations/:id', async (req, res) => {
  const locationId = req.params.id;
  const { country, address, description } = req.body; 

  try {
    // Initialize variables for dynamic query building
    const locationFieldsToUpdate = [];
    const locationValues = [];
    const assetFieldsToUpdate = [];
    const assetValues = [];

    // Check for each field and add it to the update query if provided
    if (country) {
      locationFieldsToUpdate.push('country = ?'); 
      locationValues.push(country);
    }
    if (address) {
      locationFieldsToUpdate.push('address = ?');
      locationValues.push(address);
    }
    if (description) {
      assetFieldsToUpdate.push('description = ?');
      assetValues.push(description);
    }

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    // Update the `locations` table if there are fields to update
    if (locationFieldsToUpdate.length > 0) {
      const locationQuery = `
        UPDATE locations
        SET ${locationFieldsToUpdate.join(', ')}
        WHERE id = ?
      `;
      locationValues.push(locationId); // Add `id` to the query parameters
      const [locationResult] = await connection.query(locationQuery, locationValues);

      if (locationResult.affectedRows === 0) {
        throw new Error('Location not found');
      }
    }

    // Update the `assets` table if there are fields to update
    if (assetFieldsToUpdate.length > 0) {
      const assetQuery = `
        UPDATE assets
        SET ${assetFieldsToUpdate.join(', ')}
        WHERE location_id = ?
      `;
      assetValues.push(locationId); // Use `location_id` to identify the asset
      const [assetResult] = await connection.query(assetQuery, assetValues);

      if (assetResult.affectedRows === 0) {
        throw new Error('Asset not found for the given location');
      }
    }

    // Commit the transaction
    await connection.commit();
    res.json({ message: 'Location and asset details updated successfully' });

  } catch (err) {
    // Rollback the transaction on error
    console.error('Error updating location and asset details:', err);
    res.status(500).json({ error: 'Failed to update location and asset details' });
  }
});


// API endpoint to delete a location
app.delete('/api/locations/:id', async (req, res) => {
  const locationId = req.params.id;

  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Delete related assets (if required)
    const deleteAssetsQuery = `
      DELETE FROM assets WHERE location_id = ?
    `;
    await connection.query(deleteAssetsQuery, [locationId]);

    // Delete the location itself
    const deleteLocationQuery = `
      DELETE FROM locations WHERE id = ?
    `;
    const [result] = await connection.query(deleteLocationQuery, [locationId]);

    if (result.affectedRows === 0) {
      throw new Error('Location not found');
    }

    // Commit the transaction
    await connection.commit();

    res.json({ message: 'Location and associated assets deleted successfully' });
  } catch (err) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    console.error('Error deleting location:', err);
    res.status(500).json({ error: 'Failed to delete location' });
  } finally {
    connection.release(); // Release the database connection
  }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});