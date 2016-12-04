var express = require('express');
var app = express();

app.get('/api/seed/busy-delay', function(req, res) {
  setTimeout(function() {
    res.status(204).json();
  }, 1000);
});

app.listen(9090, "localhost", function() {});