const express = require('express');
const path = require('path');
const port = 5001;
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);
console.log(`MedPort Frontend is running at http://localhost:${port}`);