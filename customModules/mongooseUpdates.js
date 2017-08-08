var url = 'mongodb://localhost:27017/';
var dbS = 'langroo';
let mongoose = require('mongoose');
let authentication = require("../authentication");
let gFunctions = require('./googleFunctions');
let mSchema = mongoose.Schema;

let populateDocs = function(fnName,doc,query){
    let conn = mongoose.createConnection(url+dbS);
    let modelsIndex = require("../Models/modelsIndex")(mongoose,conn);
    switch (fnName) {
      case 'interaction':
        let Interaction = modelsIndex.interaction,
            Student = modelsIndex.student;
        Student.findOne(query).select({"messenger user id": 1, "_id":1}).exec(function(err,student){
          if(err)throw err;
          if (student){
              doc.student_id = student._id;
              new_interaction = new Interaction(doc);
              new_interaction.save(function(err){
                Student.update(query,{$set : {"Last Interaction":{text:new_interaction.text,date:new_interaction.date }}},function(err,stu){
                  if(err)throw err;
                  return closingMongo(conn,dbS);
                });
              });
            }else{
                console.log("doc msg id: ", doc["messenger user id"]);
                let nStu = {"messenger user id": doc["messenger user id"].toString(),
                            "Last Interaction": {text:doc.text,date:doc.date}
                           };
                Student.create(nStu,function(err,stu){
                  if(err)throw err;
                  doc.student_id = stu._id;
                  new_interaction = new Interaction(doc);
                  new_interaction.save(function(err){
                    if(err)throw err;
                    return closingMongo(conn,dbS);
                  });
                });
            }
        });
        break;
      default:

    }
};
let insertFunction = function(qy, fnName, doc){
  //custom connection to database;
  let conn = mongoose.createConnection(url+dbS);
  let modelsIndex = require("../Models/modelsIndex")(mongoose,conn);
  switch (fnName) {
      case 'Student':
        let Student = modelsIndex.student,
            qy = {"messenger user id": doc["messenger user id"]};
        Student.findOne(qy).select({"messenger user id": 1, "_id":1}).exec(function(err,student){
            if(err)throw err;
            if (student){
              doc.myDate = doc.startDate;
      				delete doc.startDate;
              Student.update(qy,{$set : doc },function(err,stu){
                if(err)throw err;
                console.log('1 record updated, id: ', stu._id);
                return closingMongo(conn,dbS);
              });
            }else{
              Student.create(doc,function(err,stu){
                if(err)throw err;
                console.log('1 record created, id: ',stu._id);
                return closingMongo(conn,dbS);
              });
            }
        });
      break;
    default:
  }
  return {ok:'ok'};
}
let getDocFunction = function(query, projection, mdName,cb){
  let conn = mongoose.createConnection(url+dbS);
  let modelsIndex = require("../Models/modelsIndex")(mongoose,conn);
  switch (mdName) {
      case 'Student':
        Student = modelsIndex.student;
        //Student.post('find', function(){
        //});
        Student.find(query, projection,function(err,data){
            if(err)throw err;
            cb(data,closingMongo(conn,dbS));
        });
      break;
    default:
  }
}
let closingMongo = function(db, dbS){
                    //conn, db name
  db.close(function(){
    console.log('Info: Closing connection with mongo DB, con: ', dbS);
    return "{ok:'ok'}";
  });
}
module.exports = {
  insert: insertFunction,
  getDoc: getDocFunction,
  populateDocs: populateDocs
}
