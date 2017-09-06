
let express   = require('express');
let app       = new express();
let passport  = require('passport');
let flash     = require('connect-flash');

let morgan       = require('morgan');
let cookieParser  = require('cookie-parser');
let bodyParser    = require('body-parser');
let session       = require('express-session');
let controller    = require('./Controllers/appController');
let config        = require('./Config/config');

var port = config.server.port; // homolog

app.use(express.static('./public'));

//passport configuration
require('./config/passport')(passport);

app.use(morgan('Req ->> '));   //log every request to the console
app.use(cookieParser());  //read cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //get infos from html forms

app.set('view engine', 'ejs'); // ejs template set up
app.use(session({secret: 'meudeusdoceuquegalerachatadocaralho!'}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash());            //use connect-flash for flash msgs stored in session


controller(app,passport);
app.listen(port);

console.log("Hom - server running on port",port);
