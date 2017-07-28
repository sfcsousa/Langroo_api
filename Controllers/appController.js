module.exports = function(app){
  let authentication = require("../authentication");
  let gFunctions = require('../customModules/googleFunctions');
  let mongoFunctions = require('../customModules/mongoDBFunctions');
  let mongooseFn = require('../customModules/mongooseUpdates');
  let schedule = require('node-schedule');

  let cronTask = '*/2 * * * *';
  let sheetUpdater =  schedule.scheduleJob(cronTask,function(){
      console.log("Scheduler running every 20 minutes");
      let  qy = {},
      mdName = 'Student',
      studentSchema = {
          "first name": String,
          "last name": String,
          "messenger user id": String,
          "profile pic url": String,
          "profileLink": String,
          "startDate": String,
          "age": String,
          "Nationality": String,
          "Lives in": String,
          "Number of Friends": String,
        },
      projection = {   "startDate":1,
              "profileLink":1,
              "first name":1,
              "last name":1,
              "age":1,
              "Nationality":1,
              "Lives in":1,
              "Number of Friends":1,
              "weeks since first interaction":1,
              "last Answer to bot":1,
              "profile pic url":1};
      let  customcallback =  function(err, data){
        if(err)throw err;
        authentication.authenticate().then((auth)=>{
          gFunctions.updateData(auth, data);
        });
      };
      mongooseFn.getDoc(qy,projection,mdName,studentSchema,customcallback);
  });

  app.get('/',function(req,res){
  	res.send('root route of server! ' +  port);
  	res.end();
  });
  app.get('/insertOrUpd/Interests',function(req,res){
  	let interestSchema = {
      description : String,
      date: Date,
      dataV: String,
      studentId: Number
    };
  	res.json({ok:'ok'});
  });

  app.get('/insertOrUpd/Student',function(req,res){
  	let doc = req.query,
  		mdName = 'Student',
      studentSchema = {
      		"first name": String,
      		"last name": String,
      		"messenger user id": String,
      		"profile pic url": String,
      		"profileLink": String,
      		"startDate": String,
      		"age": String,
      		"Nationality": String,
      		"Lives in": String,
      		"Number of Friends": String,
      	},
        collection = 'students',
        dtbase = 'langroo';
  	doc.startDate = getDate();
    let select = { 'messenger user id' : doc['messenger user id']};
    //mongooseFn.update(select, studentSchema, mdName, doc);
    mongoFunctions.insertRowMongo(doc,collection,dtbase,select); /*
  	authentication.authenticate().then((auth)=>{
  		gFunctions.appendData(auth, doc);
  	});
  	mongoFunctions.insertRowMongo(doc, collection, dtbase);
    */
  	res.json({ok:'ok'});
  });

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
  		min = fullDate.getMinutes();
  	return date+"/"+month+"/"+fullDate.getFullYear()+" "+hour+":"+min;
  };
};
