const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const resqaiRoutes = require('./routes/resqai');

mongoose.connect('mongodb://localhost:27017/resqai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Middleware to trim trailing whitespace/newlines from URL
app.use((req, res, next) => {
  req.url = decodeURIComponent(req.url).trim();
  console.log(`After trimming: ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use('/api', resqaiRoutes);

// Catch-all 404 handler to log unmatched routes
app.use((req, res) => {
  console.log(`No route matched for ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`RESQAI backend running on port ${PORT}`));
