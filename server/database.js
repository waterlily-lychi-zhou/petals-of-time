const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to SQLite database file
const dbPath = path.resolve(__dirname, 'userData.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize tables
db.serialize(() => {
  // Create the Settings table that stores user preferences.
  db.run(`
    CREATE TABLE IF NOT EXISTS Settings (
      id INTEGER PRIMARY KEY,
      work_period INTEGER,
      break_period INTEGER,
      long_rest INTEGER,
      session_count INTEGER,
      last_updated DATETIME
    )
  `);

  // Create the WorkHours table that stores user's daily work time & sessions data
  // Use date as the unique key.
  db.run(`
    CREATE TABLE IF NOT EXISTS WorkHours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE,
      work_time INTEGER,
      completed_sessions INTEGER
    )
  `);
});

module.exports = db;
