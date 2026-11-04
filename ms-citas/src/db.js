// src/db.js — conexión a MySQL con los datos del archivo .env
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dateStrings: true,     // Mantiene las fechas como texto (ej. '2026-11-03T08:00')
  decimalNumbers: true,  // Los DECIMAL llegan como números
});

module.exports = pool;