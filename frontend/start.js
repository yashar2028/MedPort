const express = require('express');
const path = require('path');
const port = 5001;
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Copy logo to the build folder
const fs = require('fs');
try {
  if (fs.existsSync(path.join(__dirname, 'public', 'logo.svg'))) {
    fs.copyFileSync(
      path.join(__dirname, 'public', 'logo.svg'),
      path.join(__dirname, 'build', 'logo.svg')
    );
    console.log('Logo copied to build folder');
  }
} catch (err) {
  console.error('Error copying logo file:', err);
}

// Handle React routing, return all requests to React app
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`MedPort Frontend is running at http://localhost:${port}`);
});