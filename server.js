
let express = require('express');
let app =  express();
let bodyParser = require('body-parser');
let google = require('googleapis');
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let assert = require('assert');
let authentication = require("./authentication");

var url = 'mongodb://localhost:27017/';
var port = 9000;

app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send('root route of server! ' +  port);
	res.end();
});

app.post('/insertOrUpd/Student',function(req,res){
	var doc = req.query,
		collection = 'tb_students',
		dtbase = 'langroo';
	console.log('Name: '+req.query.firstName);	
	console.log('test: '+req.query.castan);
	console.log("student 2");
	console.log(doc);	
	
	authentication.authenticate().then((auth)=>{
		appendData(auth, doc);
	});
	insertRowMongo(doc, collection, dtbase); 
	
	res.send('inserted');
	res.end();
});

var insertRowMongo = function(doc, collection, dtbase){
	MongoClient.connect(url+dtbase, function(err, db) {
	  if (err) throw err;
	  db.collection(collection).insertOne(doc, function(err, res) {
		if (err) throw err;
		console.log("1 record inserted");
		db.close();
	  });
	});
}

function appendData(auth, doc) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: '10utEusTbOMFvtxeqp8XgpfFiJxv6cYy0aOSdVzAkuTI',
    range: 'teste123!A2:B', //Change Sheet1 if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [ [doc.firstName, doc.castan, "test - Eg"]]
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Appended");
    }
  });
}

app.listen(port);

console.log("Hom - server running on port",port);