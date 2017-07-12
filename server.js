
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

app.get('/insertOrUpd/Student',function(req,res){
	var doc = req.query,
		collection = 'tb_students',
		dtbase = 'langroo';
	doc.startDate = getDate();
	authentication.authenticate().then((auth)=>{
		appendData(auth, doc);
	});
	insertRowMongo(doc, collection, dtbase); 
	
	res.json({ok:'ok'});
});


var insertRowMongo = function(doc, collection, dtbase){
	MongoClient.connect(url+dtbase, function(err, db) {
	  if (err) throw err;	  
	  db.collection(collection).find({ 'messenger user id':doc['messenger user id'] }).toArray(function(err,docs){
		  if (docs.length > 0 ){
			  db.collection(collection).update(
				{ 'messenger user id' : doc['messenger user id']},
				{$set : {
					"first name" : doc["first name"],
					"last name" :  doc["last name"],
					"profile pic url" : doc["profile pic url"],
					"languageSchool" : doc["languageSchool"],
					"helpCancelPlan" : doc["helpCancelPlan"],
					"languageChose" : doc["languageChose"],
					"userHearAboutUs" : doc["userHearAboutUs"],
					"userLevel" : doc["userLevel"],
					"UserMotivation" : doc["UserMotivation"],
					"userAccent" : doc["userAccent"],
					"userDecision" : doc["userDecision"],
					"userInterests" : doc["userInterests"],
					"tutorGenre" : doc["tutorGenre"],
					"lessonContent" : doc["lesssonContent"],
					"lessonImage" : doc["lessonImage"],
					"lessonCounter" : doc["lessonCounter"],
					"userActive" : doc["userActive"],
					"userCantAfford" : doc["userCantAfford"],
					"userLesson" : doc["userLesson"],
					"languageSchoolCoupon" : doc["languageSchoolCoupon"],
					"userAge" : doc["userAge"],
					"feedback" : doc["feedback"],
					"generalComments" : doc["generalComments"],
					"myDate" : doc['startDate'],
					"generalFeedbackQuestion1" : doc["generalFeedbackQuestion1"],
					"generalFeedbackQuestion2" : doc["generalFeedbackQuestion2"],
					"generalFeedbackQuestion3" : doc["generalFeedbackQuestion3"],
					"generalFeedbackQuestion4" : doc["generalFeedbackQuestion4"],
					"generalFeedbackQuestion5" : doc["generalFeedbackQuestion5"]}
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
    range: 'teste123!A2:P', //Change Sheet1 if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [ [doc['messenger user id'].toString(),
				doc['last name'],	
				doc['startDate'],	
				doc['first name'],
				doc['languageChose'],
				doc['userLevel'],
				null,
				doc['lessonImage'],
				null,
				doc['lessonContent'],
				null,
				null,
				null,
				null,
				doc['lessonCounter']]
				]
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

var getDate = function(){
	var fullDate = new Date();
	var date = fullDate.getDate().toString();
	if (date.length == 1) {
		date =0+date;
	}
	var month = (fullDate.getMonth()+1).toString();
	if (month.length == 1) {
		month =0+month;
	}
	var hour = fullDate.getHours(),
		min = fullDate.getMinutes()
	return date+"/"+month+"/"+fullDate.getFullYear()+" "+hour+":"+min;
};
app.listen(port);

console.log("Hom - server running on port",port);