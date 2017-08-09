
let express = require('express');
let app =  express();
let bodyParser = require('body-parser');
let controller = require('./Controllers/appController');
let config = require('./Controllers/config');

var port = config.server.port; // homolog

app.use(bodyParser.json());

controller(app);
app.listen(port);

console.log("Hom - server running on port",port);
