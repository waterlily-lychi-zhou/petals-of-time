const express = require('express');
const db = require('./database');
const app = express();
const PORT = 5001;

app.use(express.json());

// Endpoint to update or add user settings
app.post('/settings', (req, res) => {
  const { workPeriod, breakPeriod, longRest, sessionCount } = req.body;
  const lastUpdated = new Date().toISOString();

  const updateQuery = `
    INSERT INTO Settings (id, work_period, break_period, long_rest, session_count, last_updated)
    VALUES (1, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      work_period = excluded.work_period,
      break_period = excluded.break_period,
      long_rest = excluded.long_rest,
      session_count = excluded.session_count,
      last_updated = excluded.last_updated;
  `;

  db.run(updateQuery, [workPeriod, breakPeriod, longRest, sessionCount, lastUpdated], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Settings updated successfully' });
    }
  });
});

// Endpoint to get user settings
app.get('/settings', (req, res) => {
  const query = 'SELECT * FROM Settings WHERE id = 1';
  db.get(query, [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(row);
    }
  });
});

// Endpoint to add or update work hours for a day
app.post('/work-hours', (req, res) => {
  const { date, workTime, completedSessions } = req.body;

  const insertOrUpdateQuery = `
    INSERT INTO WorkHours (date, work_time, completed_sessions)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      work_time = work_time + excluded.work_time,
      completed_sessions = completed_sessions + excluded.completed_sessions;
  `;

  db.run(insertOrUpdateQuery, [date, workTime, completedSessions], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Work hours updated successfully' });
    }
  });
});

// Endpoint to get work hours for chart
app.get('/work-hours', (req, res) => {
  const query = 'SELECT * FROM WorkHours ORDER BY date ASC';

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
