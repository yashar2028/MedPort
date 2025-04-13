const express = require('express');
const path = require('path');
const app = express();
const PORT = 5001;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// All routes serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running at http://0.0.0.0:${PORT}`);
});