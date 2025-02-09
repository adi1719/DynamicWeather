require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: false
});

const createTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS weather
        (id SERIAL PRIMARY KEY,
        description VARCHAR(255),
        type VARCHAR(255),
        temperature DOUBLE PRECISION,
        timestamp BIGINT,
        city VARCHAR(255)
        );
    `;

  try {
    await pool.query(createTableQuery);
    console.log("weather table checked/created successfully.");
  } catch (err) {
    console.error("Error creating rules table:", err);
  }
};
const createAlertTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS alerts
        (id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        thresold DOUBLE PRECISION,
        city VARCHAR(255)
        );
    `;

  try {
    await pool.query(createTableQuery);
    console.log("alert table checked/created successfully.");
  } catch (err) {
    console.error("Error creating alert table:", err);
  }
};

createTable();
createAlertTable();
module.exports = pool;