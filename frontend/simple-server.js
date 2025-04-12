const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 5001;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Make sure the build directory has the logo
try {
  fs.copyFileSync(
    path.join(__dirname, 'public', 'logo.svg'),
    path.join(__dirname, 'build', 'logo.svg')
  );
  console.log('Logo copied successfully');
} catch (err) {
  console.error('Error copying logo:', err.message);
}

// All requests that don't match an asset should serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});