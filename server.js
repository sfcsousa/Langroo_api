
let express = require('express');
let app =  express();
let bodyParser = require('body-parser');
let controller = require('./Controllers/appController');

var port = 9000; // homolog

app.use(bodyParser.json());

controller(app);
app.listen(port);

console.log("Hom - server running on port",port);
