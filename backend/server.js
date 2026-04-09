const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

// Middleware functionality
app.use(cors());
app.use(express.json());

// Routes mapping
app.use('/tasks', taskRoutes);

// Global Error Handler for unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled app error:', err);
  res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
