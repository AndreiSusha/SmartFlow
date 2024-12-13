import express from 'express'; // Use `import` for ES modules
import dotenv from 'dotenv'; // Use `import` for dotenv
import mysql from 'mysql2/promise'; // Use mysql2's `promise` import
// import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation
import { NodeSSH } from 'node-ssh';

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON in request bodies
app.use(express.json());


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});


// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Access denied, token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is not valid' });
    }
    req.user = user; // Attach user info to the request
    next();
  });
};

// Variables
// let pool;
// const ssh = new NodeSSH();

// console.log('Using database:', process.env.DB_NAME);

// async function initializeSSH() {
//   try {
//     console.log('Establishing SSH connection...');
//     await ssh.connect({
//       host: process.env.SSH_HOST,
//       port: parseInt(process.env.SSH_PORT, 10),
//       username: process.env.SSH_USER,
//       password: process.env.SSH_PASSWORD,
//     });
//     console.log('SSH connection successful!');

//     console.log('Forwarding port 3307...');
//     await ssh.forwardIn('127.0.0.1', 3309); // Local port forwarded to remote MySQL port
//     console.log('Port forwarding successful!');
//   } catch (error) {
//     console.error('SSH connection error:', error);
//     process.exit(1); // Stop the app if SSH fails
//   }
// }

// async function initializeMySQL() {
//   try {
//     console.log('Creating MySQL pool...');
//     pool = mysql.createPool({
//       host: process.env.DB_HOST,  // MySQL is forwarded to localhost via SSH
//       port: process.env.DB_PORT,  // Local forwarded port
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       waitForConnections: true,
//     });
//     console.log('MySQL pool created!');
//   } catch (error) {
//     console.error('Failed to initialize MySQL:', error);
//     process.exit(1); // Exit the process if initialization fails
//   }
// }

// async function initialize() {
//   //await initializeSSH(); // Initialize SSH first
//   await initializeMySQL(); // Then initialize MySQL
// }

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Query the database to find the user by username
    const [userResults] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (userResults.length === 0) {
      return res.status(400).send('Invalid credentials');
    }

    const user = userResults[0];

    if (user.password_hash !== password) {
      return res.status(400).send('Invalid credentials');
    }

    res.json(user);
  } catch (err) {
    console.error('Error checking login data:', err);
    res.status(500).json({ error: 'Failed to checking login' });
  }
});


// API endpoint to see the assets
app.get('/api/assets', async (req, res) => {
  const query = `
    SELECT 
      l.country,
      l.city,
      l.address,
      a.id AS asset_id,
      a.name AS asset_name,
      COUNT(DISTINCT ua.user_id) AS users_assigned
    FROM locations l
    INNER JOIN assets a ON l.id = a.location_id
    LEFT JOIN user_assets ua ON a.id = ua.asset_id
    GROUP BY l.id, l.country, l.city, l.address, a.id, a.name;
  `;

  try {
    const [results] = await pool.query(query); // Execute the query

    const formattedResults = results.map((row) => ({
      location: {
        name: `${row.country}, ${row.city}`,
        address: row.address,
      },
      asset: {
        id: row.asset_id,
        name: row.asset_name,
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
app.post('/api/assets', async (req, res) => {
  const {
    assetName,
    assetTypeName,
    additionalInformation,
    existingLocationId,
    newLocation

  } = req.body;

  // Validate core fields
  if (!assetName || !assetTypeName) {
    return res.status(400).json({ error: 'Missing required fields: assetName or assetTypeName' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Get asset_type_id
    const [assetTypeRows] = await connection.query(
      'SELECT id FROM asset_types WHERE type_name = ?',
      [assetTypeName]
    );
    if (assetTypeRows.length === 0) {

      throw new Error(`Asset type '${assetTypeName}' not found`);
    }
    const assetTypeId = assetTypeRows[0].id;

    let locationId;
    if (existingLocationId) {
      // Validate that location_id exists (optional)
      const [locationRows] = await connection.query(
        'SELECT id FROM locations WHERE id = ?',
        [existingLocationId]
      );
      if (locationRows.length === 0) {
        throw new Error(`Location with ID ${existingLocationId} not found`);
      }
      locationId = existingLocationId;
    } else if (newLocation) {
      const { country, city, address, zipCode } = newLocation;
      // Validate required fields for new location
      if (!country || !city) {
        return res.status(400).json({ error: 'Missing required location fields (country, city)' });
      }
      const [locationResult] = await connection.query(
        'INSERT INTO locations (country, city, address, zip_code, customer_id) VALUES (?, ?, ?, ?, 3)', 
        [country, city, address || null, zipCode || null]
      );
      locationId = locationResult.insertId;
    } else {
      // No existingLocationId and no newLocation provided
      return res.status(400).json({ error: 'No location information provided' });
    }

    // Insert the new asset
    const [assetResult] = await connection.query(
      'INSERT INTO assets (name, asset_type_id, location_id, description, created_at) VALUES (?, ?, ?, ?, NOW())',
      [
        assetName,
        assetTypeId,
        locationId,
        additionalInformation || null
      ]
    );


    await connection.commit();

    res.status(201).json({
      message: 'Asset added successfully',
      assetId: assetResult.insertId,
      locationId: locationId

    });
  } catch (error) {
    await connection.rollback();
    console.error('Error adding asset:', error);
    res.status(500).json({ error: 'Failed to add asset' });
  } finally {
    connection.release();
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
        a.id AS asset_id,
        l.address,
        l.city,
        l.country,
        a.description,
        at.type_name AS asset_type,
        CONCAT('+1 (555) 123-4567', ', ', '+1 (555) 125-4561') AS contact_info -- Hardcoded for now
      FROM assets a
      LEFT JOIN locations l ON a.location_id = l.id
      LEFT JOIN asset_types at ON a.asset_type_id = at.id
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
      users: userResults,
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
      const [locationResult] = await connection.query(
        locationQuery,
        locationValues
      );

      if (locationResult.affectedRows === 0) {
        console.warn(
          'No associated location found for the given asset. Skipping location update.'
        );
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
    res
      .status(500)
      .json({ error: 'Failed to update asset details', details: err.message });
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


//// API endpoint for measurements
app.get('/api/measurements', async (req, res) => {
  const queries = {
    temperature: `
      SELECT 
        id,
        timestamp AS time,
        value AS value,
        unit AS unit
      FROM temperature_measurements;
    `,
    co2: `
      SELECT 
        id,
        timestamp AS time,
        value AS value,
        unit AS unit
      FROM co2_measurements;
    `,
    vdd: `
      SELECT 
        id,
        timestamp AS time,
        value AS value,
        unit AS unit
      FROM vdd_measurements;
    `,
    humidity: `
      SELECT 
        id,
        timestamp AS time,
        value AS value,
        unit AS unit
      FROM humidity_measurements;
    `,
  };

  try {
    const temperaturePromise = pool.query(queries.temperature);
    const co2Promise = pool.query(queries.co2);
    const vddPromise = pool.query(queries.vdd);
    const humidityPromise = pool.query(queries.humidity);

    const [temperatureResults] = await temperaturePromise;
    const [co2Results] = await co2Promise;
    const [vddResults] = await vddPromise;
    const [humidityResults] = await humidityPromise;

    res.json({
      temperature: temperatureResults,
      co2: co2Results,
      vdd: vddResults,
      humidity: humidityResults,
    });
  } catch (err) {
    console.error('Error fetching measurements:', err);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});

// API Endpoint to display data from measurements type tables
app.get('/api/measurement-report', async (req, res) => {
  try {
    // Queries to return all raw values for temperature
    const temperatureDailyQuery = `
      SELECT 
        DATE(timestamp) AS date,
        MAX(value) AS highestValue,
        MIN(value) AS lowestValue
      FROM temperature_measurements
      GROUP BY DATE(timestamp)
      ORDER BY DATE(timestamp);
    `;

    const temperatureWeeklyQuery = `
      SELECT 
        WEEK(timestamp) AS weekNumber,
        MAX(value) AS highestValue,
        MIN(value) AS lowestValue
      FROM temperature_measurements
      GROUP BY WEEK(timestamp)
      ORDER BY WEEK(timestamp);
    `;

    const temperatureMonthlyQuery = `
      SELECT 
        MONTH(timestamp) AS monthNumber,
        MAX(value) AS highestValue,
        MIN(value) AS lowestValue
      FROM temperature_measurements
      GROUP BY MONTH(timestamp)
      ORDER BY MONTH(timestamp);
    `;

    const temperatureYearlyQuery = `
      SELECT 
        YEAR(timestamp) AS yearNumber,
        MAX(value) AS highestValue,
        MIN(value) AS lowestValue
      FROM temperature_measurements
      GROUP BY YEAR(timestamp)
      ORDER BY YEAR(timestamp);
    `;

    // Queries to return highest and lowest values for humidity
    const humidityDailyQuery = `
      SELECT 
        DATE(timestamp) AS date,
        MAX(value) AS highestValue,
        MIN(value) AS lowestValue
      FROM humidity_measurements
      GROUP BY DATE(timestamp)
      ORDER BY DATE(timestamp);
    `;

    const humidityWeeklyQuery = `
      SELECT 
        WEEK(timestamp) AS weekNumber,
        MAX(value) AS highestValue,
        MIN(value) AS lowestValue
      FROM humidity_measurements
      GROUP BY WEEK(timestamp)
      ORDER BY WEEK(timestamp);
    `;

    const humidityMonthlyQuery = `
      SELECT 
        MONTH(timestamp) AS monthNumber,
        MAX(value) AS highestValue,
        MIN(value) AS lowestValue
      FROM humidity_measurements
      GROUP BY MONTH(timestamp)
      ORDER BY MONTH(timestamp);
    `;

    const humidityYearlyQuery = `
      SELECT 
        YEAR(timestamp) AS yearNumber,
        MAX(value) AS highestValue,
        MIN(value) AS lowestValue
      FROM humidity_measurements
      GROUP BY YEAR(timestamp)
      ORDER BY YEAR(timestamp);
    `;

    // Queries to calculate SUM for VDD and CO2 (unchanged)
    const vddDailyQuery = `
      SELECT 
        DATE(timestamp) AS date,
        SUM(value) AS value
      FROM vdd_measurements
      GROUP BY DATE(timestamp);
    `;
    const vddWeeklyQuery = `
      SELECT 
        WEEK(timestamp) AS weekNumber,
        SUM(value) AS value
      FROM vdd_measurements
      GROUP BY WEEK(timestamp);
    `;
    const vddMonthlyQuery = `
      SELECT 
        MONTH(timestamp) AS monthNumber,
        SUM(value) AS value
      FROM vdd_measurements
      GROUP BY MONTH(timestamp);
    `;
    const vddYearlyQuery = `
      SELECT 
        YEAR(timestamp) AS yearNumber,
        SUM(value) AS value
      FROM vdd_measurements
      GROUP BY YEAR(timestamp);
    `;

    const co2DailyQuery = `
      SELECT 
        DATE(timestamp) AS date,
        SUM(value) AS value
      FROM co2_measurements
      GROUP BY DATE(timestamp);
    `;
    const co2WeeklyQuery = `
      SELECT 
        WEEK(timestamp) AS weekNumber,
        SUM(value) AS value
      FROM co2_measurements
      GROUP BY WEEK(timestamp);
    `;
    const co2MonthlyQuery = `
      SELECT 
        MONTH(timestamp) AS monthNumber,
        SUM(value) AS value
      FROM co2_measurements
      GROUP BY MONTH(timestamp);
    `;
    const co2YearlyQuery = `
      SELECT 
        YEAR(timestamp) AS yearNumber,
        SUM(value) AS value
      FROM co2_measurements
      GROUP BY YEAR(timestamp);
    `;

    // Execute queries in parallel
    const [
      temperatureDaily,
      temperatureWeekly,
      temperatureMonthly,
      temperatureYearly,
      vddDaily,
      vddWeekly,
      vddMonthly,
      vddYearly,
      co2Daily,
      co2Weekly,
      co2Monthly,
      co2Yearly,
      humidityDaily,
      humidityWeekly,
      humidityMonthly,
      humidityYearly,
    ] = await Promise.all([
      pool.query(temperatureDailyQuery),
      pool.query(temperatureWeeklyQuery),
      pool.query(temperatureMonthlyQuery),
      pool.query(temperatureYearlyQuery),
      pool.query(vddDailyQuery),
      pool.query(vddWeeklyQuery),
      pool.query(vddMonthlyQuery),
      pool.query(vddYearlyQuery),
      pool.query(co2DailyQuery),
      pool.query(co2WeeklyQuery),
      pool.query(co2MonthlyQuery),
      pool.query(co2YearlyQuery),
      pool.query(humidityDailyQuery),
      pool.query(humidityWeeklyQuery),
      pool.query(humidityMonthlyQuery),
      pool.query(humidityYearlyQuery),
    ]);

    // Combine data into a single response
    res.json({
      temperature: {
        daily: temperatureDaily[0],
        weekly: temperatureWeekly[0],
        monthly: temperatureMonthly[0],
        yearly: temperatureYearly[0],
      },
      vdd: {
        daily: vddDaily[0],
        weekly: vddWeekly[0],
        monthly: vddMonthly[0],
        yearly: vddYearly[0],
      },
      co2: {
        daily: co2Daily[0],
        weekly: co2Weekly[0],
        monthly: co2Monthly[0],
        yearly: co2Yearly[0],
      },
      humidity: {
        daily: humidityDaily[0],
        weekly: humidityWeekly[0],
        monthly: humidityMonthly[0],
        yearly: humidityYearly[0],
      },
    });
  } catch (err) {
    console.error('Error fetching measurement report:', err);
    res.status(500).json({ error: 'Failed to fetch measurement report' });
  }
});

// API endpoint for retrieving monthly measurements
app.get('/api/measurements/last-calendar-month', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }

  const queries = {
    temperature: `
      SELECT
        YEAR(timestamp) AS year,
        MONTH(timestamp) AS month,
        SUM(value) AS total_value,
        unit
      FROM temperature_measurements
      WHERE MONTH(timestamp) = ?
      GROUP BY YEAR(timestamp), MONTH(timestamp), unit
      ORDER BY year, month;
    `,
    co2: `
      SELECT
        YEAR(timestamp) AS year,
        MONTH(timestamp) AS month,
        SUM(value) AS total_value,
        unit
      FROM co2_measurements
      WHERE MONTH(timestamp) = ?
      GROUP BY YEAR(timestamp), MONTH(timestamp), unit
      ORDER BY year, month;
    `,
    vdd: `
      SELECT
        YEAR(timestamp) AS year,
        MONTH(timestamp) AS month,
        SUM(value) AS total_value,
        unit
      FROM vdd_measurements
      WHERE MONTH(timestamp) = ?
      GROUP BY YEAR(timestamp), MONTH(timestamp), unit
      ORDER BY year, month;
    `,
    humidity: `
      SELECT
        YEAR(timestamp) AS year,
        MONTH(timestamp) AS month,
        SUM(value) AS total_value,
        unit
      FROM humidity_measurements
      WHERE MONTH(timestamp) = ?
      GROUP BY YEAR(timestamp), MONTH(timestamp), unit
      ORDER BY year, month;
    `,
  };

  try {
    const temperaturePromise = pool.query(queries.temperature, [month]);
    const co2Promise = pool.query(queries.co2, [month]);
    const vddPromise = pool.query(queries.vdd, [month]);
    const humidityPromise = pool.query(queries.humidity, [month]);

    const [temperatureResults] = await temperaturePromise;
    const [co2Results] = await co2Promise;
    const [vddResults] = await vddPromise;
    const [humidityResults] = await humidityPromise;

    res.json({
      temperature: temperatureResults,
      co2: co2Results,
      vdd: vddResults,
      humidity: humidityResults,
    });
  } catch (err) {
    console.error('Error fetching measurements:', err);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});

app.get('/users/:customer_id', async (req, res) => {
  const customerId = req.params.customer_id;

  try {
    // Query to select everything from the users table, along with their asset details
    const query = `
      SELECT u.*, 
             a.id AS asset_id, a.name AS asset_name, a.asset_type_id, a.location_id, a.created_at AS asset_created_at
      FROM users u
      LEFT JOIN user_assets ua ON u.id = ua.user_id
      LEFT JOIN assets a ON ua.asset_id = a.id
      WHERE u.customer_id = ?;
    `;

    // Execute the query with the customer_id parameter
    const [results] = await pool.query(query, [customerId]);

    if (results.length === 0) {
      return res.status(404).send('No users or assets found for this customer');
    }

    // Return the list of users with their assets
    res.json(results);
  } catch (err) {
    console.error('Error fetching users and assets:', err.stack);
    res.status(500).send('Error fetching users and assets');
  }
});

// Fetch a single user by their id
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Query to join users, user_assets, and assets tables
    const query = `
      SELECT u.*,
             a.id AS asset_id, a.name AS asset_name, a.asset_type_id, a.location_id, a.created_at AS asset_created_at
      FROM users u
      LEFT JOIN user_assets ua ON u.id = ua.user_id
      LEFT JOIN assets a ON ua.asset_id = a.id
      WHERE u.id = ?;
    `;

    // Execute the query with the user_id parameter
    const [results] = await pool.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    // Return the user with their assets
    res.json(results);
  } catch (err) {
    console.error('Error fetching user by ID and assets:', err.stack);
    res.status(500).send('Error fetching user and assets');
  }
});

// Update a user by ID
app.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const {
    username,
    email,
    password_hash,
    role_id,
    customer_id,
    asset_id,
    asset_name,
    phone_number,
    user_summary,
  } = req.body;

  if (
    !username &&
    !email &&
    !password_hash &&
    !role_id &&
    !customer_id &&
    !asset_id &&
    !asset_name &&
    !phone_number &&
    !user_summary
  ) {
    return res.status(400).send('No fields to update');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let updateResults = {
      userUpdated: false,
      assetUpdated: false,
      assetAssigned: false,
      errors: [],
    };

    const userFields = [];
    const userValues = [];

    if (username) {
      userFields.push('username = ?');
      userValues.push(username);
    }
    if (email) {
      userFields.push('email = ?');
      userValues.push(email);
    }
    if (password_hash) {
      userFields.push('password_hash = ?');
      userValues.push(password_hash);
    }
    if (role_id) {
      userFields.push('role_id = ?');
      userValues.push(role_id);
    }
    if (customer_id) {
      userFields.push('customer_id = ?');
      userValues.push(customer_id);
    }
    if (phone_number) {
      userFields.push('phone_number = ?');
      userValues.push(phone_number);
    }
    if (user_summary) {
      userFields.push('user_summary = ?');
      userValues.push(user_summary);
    }

    userValues.push(userId);

    if (userFields.length > 0) {
      const userQuery = `UPDATE users SET ${userFields.join(
        ', '
      )} WHERE id = ?`;
      const [userResult] = await connection.query(userQuery, userValues);
      if (userResult.affectedRows > 0) updateResults.userUpdated = true;
      else updateResults.errors.push('User not found');
    }

    if (asset_id || asset_name) {
      const assetCheckQuery = `SELECT id FROM assets WHERE id = ?`;
      const [assetCheckResult] = await connection.query(assetCheckQuery, [
        asset_id,
      ]);

      if (assetCheckResult.length > 0) {
        if (asset_name) {
          const assetUpdateQuery = `UPDATE assets SET name = ? WHERE id = ?`;
          await connection.query(assetUpdateQuery, [asset_name, asset_id]);
          updateResults.assetUpdated = true;
        }

        if (asset_id) {
          const userAssetQuery = `
            INSERT INTO user_assets (user_id, asset_id) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE asset_id = VALUES(asset_id);
          `;
          await connection.query(userAssetQuery, [userId, asset_id]);
          updateResults.assetAssigned = true;
        }
      } else {
        updateResults.errors.push(`Asset with ID ${asset_id} not found`);
      }
    }

    await connection.commit();

    const [updatedUser] = await connection.query(
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );
    res.status(200).json({ updateResults, updatedUser });
  } catch (err) {
    await connection.rollback();
    console.error('Error updating user and assets:', err.stack);
    res.status(500).send('Error updating user and assets');
  } finally {
    connection.release();
  }
});

// Delete a user by ID
app.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  try {
    // Delete related data first
    await pool.query('DELETE FROM user_assets WHERE user_id = ?', [userId]);

    // Then delete the user
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.send('User and related data deleted successfully');
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
    return res
      .status(400)
      .send(
        'All fields are required: username, email, password_hash, role_id, customer_id'
      );
  }

  try {
    // Insert the new user into the database
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, role_id, customer_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, password_hash, role_id, customer_id]
    );

    // Respond with the ID of the newly created user
    res
      .status(201)
      .json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle duplicate key error (e.g., username or email already exists)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).send('Username or email already exists');
    }

    res.status(500).send('Error creating user');
  }
});



app.get('/locations/:customerId', async (req, res) => {
  const { customerId } = req.params;

  // Validate input
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  try {
    // Query the database
    const [rows] = await pool.query(
      `SELECT * FROM locations WHERE customer_id = ?`,
      [customerId]
    );

    // Check if no locations are found
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No locations found for the given customer' });
    }

    // Return locations
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving locations:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// retrieve the measurement types for the asset
app.get('/api/assets/:id/measurements', async (req, res) => {
  const assetId = req.params.id;

  const query = `
    SELECT atm.measurement_type, atm.unit
    FROM asset_type_measurements AS atm
    INNER JOIN assets AS a ON a.asset_type_id = atm.asset_type_id
    WHERE a.id = ?
  `;

  try {
    const [rows] = await pool.query(query, [assetId]);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching measurements:", error);
    res.status(500).json({ error: "Failed to fetch measurements" });
  }
});



//// API endpoint for measurements
app.get('/api/measurements', async (req, res) => {
  const queries = {
    temperature: `
      SELECT 
        id,
        timestamp AS time,
        value AS value,
        unit AS unit
      FROM temperature_measurements;
    `,
    co2: `
      SELECT 
        id,
        timestamp AS time,
        value AS value,
        unit AS unit
      FROM co2_measurements;
    `,
    vdd: `
      SELECT 
        id,
        timestamp AS time,
        value AS value,
        unit AS unit
      FROM vdd_measurements;
    `,
    humidity: `
      SELECT 
        id,
        timestamp AS time,
        value AS value,
        unit AS unit
      FROM humidity_measurements;
    `,
  };

  try {
    const temperaturePromise = pool.query(queries.temperature);
    const co2Promise = pool.query(queries.co2);
    const vddPromise = pool.query(queries.vdd);
    const humidityPromise = pool.query(queries.humidity);

    const [temperatureResults] = await temperaturePromise;
    const [co2Results] = await co2Promise;
    const [vddResults] = await vddPromise;
    const [humidityResults] = await humidityPromise;

    res.json({
      temperature: temperatureResults,
      co2: co2Results,
      vdd: vddResults,
      humidity: humidityResults,
    });
  } catch (err) {
    console.error('Error fetching measurements:', err);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});




app.get("/measurements", async (req, res) => {
  const measurementTable = req.query.measurementTable;
  const assetId = req.query.assetId;
  const period = req.query.period;

  // Validate input parameters
  if (!measurementTable || !assetId || !period) {
    return res
      .status(400)
      .json({ error: "Missing required query parameters." });
  }

  // Allowed measurement tables to prevent SQL injection
  const allowedTables = [
    "co2_measurements",
    "humidity_measurements",
    "light_measurements",
    "temperature_measurements",
    "vdd_measurements",
    // Add other measurement tables as needed
  ];

  if (!allowedTables.includes(measurementTable)) {
    return res
      .status(400)
      .json({ error: "Invalid measurement table specified." });
  }

  try {
    const idColumn = "asset_id"; // Use 'asset_id' as per your table schema

    // First, find the latest timestamp in the measurement table for the given assetId
    const latestDateQuery = `
      SELECT MAX(timestamp) AS latestTimestamp
      FROM \`${measurementTable}\`
      WHERE ${idColumn} = ?
    `;

    const [latestDateResult] = await pool.query(latestDateQuery, [assetId]);

    if (!latestDateResult || !latestDateResult[0].latestTimestamp) {
      return res
        .status(404)
        .json({ error: "No data found for the given assetId." });
    }

    const latestTimestamp = new Date(latestDateResult[0].latestTimestamp);
    console.log("Latest Timestamp from Database:", latestTimestamp);
    console.log("Latest Timestamp (ISOString):", latestTimestamp.toISOString());

    // Adjust currentDate if necessary
    const dataEndDate = new Date("2022-12-31T23:59:59"); // Adjust based on your data
    // const currentDate = latestTimestamp > dataEndDate ? dataEndDate : latestTimestamp;
    const currentDate = latestTimestamp;

    // Define the date range based on the period
    let startDate;
    let endDate = currentDate;

    if (period === "last_week") {
      // Set startDate to 6 days before currentDate
      startDate = new Date(latestTimestamp.getTime() - 6 * 24 * 60 * 60 * 1000);
    } else if (period === "last_3_months") {
      startDate = new Date(currentDate);
      startDate.setMonth(currentDate.getMonth() - 2); // Include the current month and two previous months
      startDate.setDate(1); // Start from the first day of the month
    } else if (period === "past_year") {
      startDate = new Date(currentDate);
      startDate.setFullYear(currentDate.getFullYear() - 1); // One year back from currentDate
      // Keep the same month and day
    } else {
      return res.status(400).json({ error: "Invalid period specified." });
    }

    const startDateStr = startDate.toISOString().slice(0, 19).replace("T", " ");
    const endDateStr = endDate.toISOString().slice(0, 19).replace("T", " ");

    console.log("Start Date:", startDateStr);
    console.log("End Date:", endDateStr);

    // Construct the SQL query
    const dataQuery = `
      SELECT id, timestamp, value, ${idColumn}
      FROM \`${measurementTable}\`
      WHERE ${idColumn} = ? AND timestamp BETWEEN ? AND ?
      ORDER BY timestamp ASC
    `;

    const [dataResults] = await pool.query(dataQuery, [
      assetId,
      startDateStr,
      endDateStr,
    ]);

    // Process the results to match the required data format for charts
    let responseData = [];

    // Data aggregation based on the period
    if (period === "last_week") {
      responseData = processDataByDay(dataResults, startDate, endDate);
    } else if (period === "last_3_months") {
      responseData = processDataByWeek(dataResults, startDate, endDate);
    } else if (period === "past_year") {
      responseData = processDataByMonth(dataResults, startDate, endDate);
    }

    res.json(responseData);
  } catch (err) {
    console.error("Error fetching measurements:", err);
    res.status(500).json({ error: "Database query error." });
  }
});

// Function to process data by day for 'last_week'
function processDataByDay(results, startDate, endDate) {
  const dataByDate = {};
  const dateList = [];
  const responseData = [];

  // Generate list of dates between startDate and endDate
  let current = new Date(Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate()
  ));
  const end = new Date(Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate()
  ));

  while (current <= end) {
    const dateStr = current.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    dateList.push(dateStr);
    dataByDate[dateStr] = [];
    current.setUTCDate(current.getUTCDate() + 1); // Move to next day in UTC
  }

  // Map results to the corresponding date
  results.forEach((row) => {
    const date = new Date(row.timestamp);
    const dateStr = date.toISOString().slice(0, 10);

    if (dataByDate.hasOwnProperty(dateStr)) {
      dataByDate[dateStr].push(parseFloat(row.value));
    }
  });

  // Build responseData
  dateList.forEach((dateStr) => {
    const values = dataByDate[dateStr];
    const sum = values.reduce((a, b) => a + b, 0);
    const averageValue = values.length ? sum / values.length : null;
    responseData.push({
      date: dateStr,
      averageValue: averageValue !== null ? parseFloat(averageValue.toFixed(2)) : null,
    });
  });

  return responseData;
}


// Helper function to get ISO week number and year
function getWeekNumberISO(date) {
  const dateCopy = new Date(date.getTime());
  dateCopy.setHours(0, 0, 0, 0);
  dateCopy.setDate(dateCopy.getDate() + 4 - (dateCopy.getDay() || 7));
  const yearStart = new Date(dateCopy.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((dateCopy - yearStart) / 86400000 + 1) / 7);
  return { week: weekNo, year: dateCopy.getFullYear() };
}

// Function to process data by week for 'last_3_months'
function processDataByWeek(results, startDate, endDate) {
  const dataByWeek = {};

  // Collect data into dataByWeek
  results.forEach((row) => {
    const date = new Date(row.timestamp);
    const { week, year } = getWeekNumberISO(date);
    const weekKey = `${year}-W${week}`;

    if (!dataByWeek[weekKey]) {
      dataByWeek[weekKey] = [];
    }
    dataByWeek[weekKey].push(parseFloat(row.value));
  });

  // Generate list of weeks between startDate and endDate
  const weekKeysInRange = [];
  const weekStartDates = {}; // To store the actual starting date for each week

  let current = new Date(startDate);
  // Align 'current' to the start of the week (Monday)
  const day = current.getDay();
  const diff = (day === 0 ? 6 : day - 1); // If Sunday (0), go back 6 days, else go back (day-1)
  current.setDate(current.getDate() - diff);

  while (current <= endDate) {
    const { week, year } = getWeekNumberISO(current);
    const weekKey = `${year}-W${week}`;
    if (!weekKeysInRange.includes(weekKey)) {
      weekKeysInRange.push(weekKey);
      // Store the start date of the week
      const weekStartStr = current.toISOString().slice(0, 10); // YYYY-MM-DD
      weekStartDates[weekKey] = weekStartStr;
    }
    current.setDate(current.getDate() + 7); // Move to next week
  }

  const responseData = [];

  weekKeysInRange.forEach((weekKey) => {
    const values = dataByWeek[weekKey] || [];
    const sum = values.reduce((a, b) => a + b, 0);
    const averageValue = values.length ? sum / values.length : null;
    responseData.push({
      date: weekStartDates[weekKey],
      averageValue: averageValue !== null ? parseFloat(averageValue.toFixed(2)) : null,
    });
  });

  return responseData;
}


// Function to process data by month for 'past_year'
function processDataByMonth(results, startDate, endDate) {
  const dataByMonth = {};

  // Collect data into dataByMonth
  results.forEach((row) => {
    const date = new Date(row.timestamp);
    const monthKey = `${date.getFullYear()}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}`; // 'YYYY-MM'

    if (!dataByMonth[monthKey]) {
      dataByMonth[monthKey] = [];
    }
    dataByMonth[monthKey].push(parseFloat(row.value));
  });

  // Generate list of months between startDate and endDate
  const monthKeysInRange = [];
  let current = new Date(startDate);
  current.setDate(1); // Set to first day of month
  while (current <= endDate) {
    const monthKey = `${current.getFullYear()}-${(
      "0" +
      (current.getMonth() + 1)
    ).slice(-2)}`;
    monthKeysInRange.push(monthKey);
    current.setMonth(current.getMonth() + 1); // Move to next month
  }

  const responseData = [];

  monthKeysInRange.forEach((monthKey) => {
    const values = dataByMonth[monthKey];
    if (values && values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      const averageValue = sum / values.length;
      responseData.push({
        monthLabel: monthKey,
        averageValue: parseFloat(averageValue.toFixed(2)),
      });
    }
    // Optionally, exclude months with no data by not adding them to responseData
  });

  return responseData;
}







// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
