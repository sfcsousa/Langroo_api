
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
	console.log(doc);	
	doc.starDate = "date"
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
	  db.collection(collection).find({ msgId:doc.msgId }).toArray(function(err,docs){
		  if (docs.length > 0 ){
			  db.collection(collection).update(
				{query:{ msgId:doc.msgId }},
				{$set : {
						First_Name : doc.First_Name,
						Last_Name : doc.Last_Name,
						User_Email : doc.User_Email,
						Profile_Picture : doc.Profile_Picture,
						Last_Interaction_Date : doc.Last_Interaction_Date,
						LanguageSchool : doc.LanguageSchool,
						HelpCancelPlan : doc.HelpCancelPlan,
						Language_Chosen  : doc.Language_Chosen,
						Hear_About_Us : doc.Hear_About_Us,
						User_Language_Level : doc.User_Language_Level,
						User_Motivation : doc.User_Motivation,
						Start_Learning_Want_Tutor : '',
						Tutor_Gender : doc.Tutor_Gender,
						user_time : doc.user_time,
						user_accent : doc.user_accent,
						user_interests : doc.user_interests,
						locale : doc.locale}
				},
				{ upsert: true },
				function(err,res){
					if (err) throw err;
					console.log("1 record updated");
					db.close();
				});
		  }else{
			db.collection(collection).insertOne(doc, function(err, res) {
				if (err) throw err;
				console.log("1 record inserted");
				db.close();
			});  
		  }		  
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