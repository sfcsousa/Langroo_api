module.exports = function(app,passport){
  let authentication = require("../authentication");
  let gFunctions = require('../customModules/googleFunctions');
  let mongoFunctions = require('../customModules/mongoDBFunctions');
  let mongooseFn = require('../customModules/mongooseUpdates');
  let schedule = require('node-schedule');
    
  var url = config.mongo.url;
  var dbS = config.mongo.db;
  let mongoose = require('mongoose');
	  mongoose.Promise = global.Promise;
  let conn = mongoose.createConnection(url+dbS);
  
  let cronTask = '*/59 8-20 * * *';
  let sheetUpdater =  schedule.scheduleJob(cronTask,function(){
      console.log("Scheduler running every 20 minutes");
      let  qy = {},
      mdName = 'Student',
      projection = {   "startDate":1,
              "profileLink":1,
              "first name":1,
              "last name":1,
              "age":1,
              "Nationality":1,
              "Lives in":1,
              "Number of Friends":1,
              "weeks since first interaction":1,
              "Last Interaction":1,
              "profile pic url":1};
      let  customFun =  function(data,closing){
        authentication.authenticate().then((auth)=>{
          gFunctions.updateData(auth, data);
        });
        return closing;
      };
      mongooseFn.getDoc(qy,projection,mdName,customFun);
  });
  
  let fbRoutes = require('./fbRoutes');
	  fbRoutes(app, passport, mongooseFn);	
  
  app.get('/insertOrUpd/Interests',function(req,res){

  	res.json({ok:'ok'});
  });
  app.get('/Student/Interactions',function(req,res){
    let doc = req.query,
        qy = {"messenger user id":doc["messenger user id"]},
        msg = {"redirect_to_blocks": [doc.testUserlast]};
    doc.date = getDate();
        if(doc.userNeedsHelp ==='default'){
          msg = {'ok':'ok'};
        }
    let cb = function(res, msg){
              res.send(msg);
            },
      cbObj = {
        callb : cb,
        message : msg,
        response : res
      };
    mongooseFn.populateDocs('interaction',doc,qy,cbObj)//(fnName,doc,query,cbObj)
  });
  app.get('/insertOrUpd/Student',function(req,res){
  	let doc = req.query,
  		mdName = 'Student';
    doc.startDate = getDate();
    doc["Lives in"] = doc.userCountry
    let select = { 'messenger user id' : doc['messenger user id']};
    mongooseFn.insert(select, mdName, doc);

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
	  if(min.length == 1){ min = '0' +min;}
  	return date+"/"+month+"/"+fullDate.getFullYear()+" "+hour+":"+min;
  };
};
