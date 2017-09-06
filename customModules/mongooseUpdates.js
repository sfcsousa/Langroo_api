let config = require('../Config/config');
var url = config.mongo.url;
var dbS = config.mongo.db;
let mongoose = require('mongoose');
let authentication = require("../authentication");
let gFunctions = require('./googleFunctions');
let mSchema = mongoose.Schema;

let populateDocs = function(fnName,doc,query,cbObj){
    let conn = mongoose.createConnection(url+dbS);
    let modelsIndex = require("../Models/modelsIndex")(mongoose,conn);
    switch (fnName) {
	  case 'studentFB':
		let StudentFB = modelsIndex.studentFB,
			Student   = modelsIndex.student;
		
		StudentFB.findOne(query).exec((err,stuFB)=>{
		  if(err)throw err;
          if (stuFB){
                stuFB["messenger user id"] = doc['messenger user id'];
				Student.findOne({"messenger user id":doc['messenger user id']}).exec((err,student)=>{
					if(err)throw err;
					if(student){
						stuFB.student_id = student._id;
						stuFB.save(function(err){
							closingMongo(conn,dbS);
							cbObj.req.user = stuFB;
							cbObj.req.user['first name'] = student['first name'];
							return cbObj.fn(cbObj.req,cbObj.res,cbObj.next);
						});
					}
				});
			
			}
		});
		break;
      case 'interaction':
        doc["chatFuel_block_id"] = doc["testeUserLast_Id"];
        doc["chatFuel_block_name"] = doc.testUserlast;
        if (!doc.text){doc.text = doc['last user freeform input'];}
        let Interaction = modelsIndex.interaction,
            Student = modelsIndex.student;
        Student.findOne(query).select({"messenger user id": 1, "_id":1}).exec(function(err,student){
          if(err)throw err;
          if (student){
              doc.student_id = student._id;
			        console.log("Interaction Document ",doc);
              new_interaction = new Interaction(doc);
              new_interaction.save(function(err){
                Student.update(query,{$set : {"Last Interaction":{text:new_interaction.text,date:new_interaction.date }}},function(err,stu){
                  if(err)throw err;
                  closingMongo(conn,dbS);
                  return cbObj.callb(cbObj.response,cbObj.message);
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
                    closingMongo(conn,dbS);
                    return cbObj.callb(cbObj.response,cbObj.message);
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
            studentInfo = modelsIndex.studentInfo,
            qy = {"messenger user id": doc["messenger user id"]};
        Student.findOne(qy).select({"messenger user id": 1, "_id":1}).exec(function(err,student){
            if(err)throw err;
            if (student){
              doc.date = doc.startDate;
      				delete doc.startDate;
              console.log("doc: ",doc);
              Student.findOneAndUpdate(qy, doc ,function(err,stu){
                if(err)throw err;
                console.log('1 record updated, id: ', student._id);
                doc.student_id = student._id;
                studentInfo.findOneAndUpdate(qy,doc,{ upsert:true, new:true},function(err,stuInfo){
                  Student.update(qy,{$set : {studentInfo_id : stuInfo._id  }},function(err){
                    if(err)throw err;
                    console.log('1 record updated, id: ', stu._id,"Info id: ",stuInfo._id);
                    let cb = function(res, msg){
                          return res+msg;},
                      cbObj = {
                        callb : cb,
                        message : 'OK',
                        response : "OK"
                      };
                      closingMongo(conn,dbS);
                      doc.text = "updated";
                      /*Handling user state, yes = freecontent
                      started = tutor now!*/
                      switch (doc.userVoando) {
                        case 'yes':
                            doc.text = "active";
                          break;
                       case 'started':
                            doc.text = "tutorActive";
                          break;
                        default:

                      }
                      return populateDocs('interaction',doc,qy,cbObj);
                  });
                });
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
	  case 'assignedcontent':
		let AssContent = modelsIndex.assignedContent;
		AssContent.find(query, projection,function(err,data){
			if(err) throw err;
			closingMongo(conn,dbS);
			return cb.fn(cb.req, cb.res, data);
		});
	  break;
	  case 'content':
		let Content = modelsIndex.content;
		let AssContent = modelsIndex.assignedContent;
		Content.findOne(query).select(projection).exec(function(err,content){
            if(err)throw err;
			if(content){
				AssContent.findOne({'content_id':content._id},function(err,assContent){
					assContent.completed = true;
					assContent.save(function(err){
						if (err)
                           throw err;
						   closingMongo(conn,dbS);
						   return cb.fn(cb.req, cb.res, content);
					})
				});
			}
        });
	  break;
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
