var express = require('express');
var app = express();

var options = {
  index: 'index.html'
};

app.use('/', express.static('/home/site/wwwroot', options));

app.listen(process.env.PORT);