const express = require('express');
const app = express();

app.get('/api/seed/busy-delay', function(req, res) {
  setTimeout(function() {
    res.status(204).json();
  }, 1000);
});

app.get('/api/seed/error404', function(req, res) {
  setTimeout(function() {
    res.status(404).json(['Not Found']);
  }, 1000);
});

app.get('/api/seed/error500', function(req, res) {
  setTimeout(function() {
    res.status(500).json(['Error on', 'unknown place!']);
  }, 1000);
});

app.listen(9090, 'localhost', function() {});
