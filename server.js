
let express = require('express');
let app =  express();
let bodyParser = require('body-parser');
let google = require('googleapis');
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let authentication = require("./authentication");

var url = 'mongodb://localhost:27017/';

app.use(bodyParser.json());

app.post('/insertOrUpd/Student',function(req,res){
	var doc = req.body,
		collection = 'tb_students',
		dtbase = 'langroo';
	console.log("student");
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
      values: [ [doc.name, "Test", "Eg"]]
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

app.listen(7979);

console.log("Hom - server running on port 7979");