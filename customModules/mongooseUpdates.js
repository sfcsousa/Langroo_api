var url = 'mongodb://localhost:27017/';
var dbS = 'langroo';
let mongoose = require('mongoose');
let authentication = require("../authentication");
let gFunctions = require('./googleFunctions');
let mSchema = mongoose.Schema;

let insertFunction = function(dschema, mdName, data){
  let db = mongoose.createConnection();
  let r;
  let dSchema = new mSchema(dschema);
  //connect to the database
  db.open(url+dbS);

  switch (mdName) {
      case 'Interest':
          let Interest = db.model(mdName, dschema);
          Interest(data).save(function(err){
            if(err)throw err;
            closingMongo(db,dbS);
          });
      break;
      case 'Student':
        let Student = db.model(mdName, dschema);
        let newStudent = new Student(data).save(function(err){
          if(err)throw err;
          closingMongo(db,dbS);
          console.log('Item saved');
        });
      break;
    default:
  }
}
let updateFunction = function(conditions, dschema, mdName, data){
    let db = mongoose.createConnection();
    let r;
    dschema = new mSchema(dschema);
    //connect to the database
    db.open(url+dbS);
    switch (mdName) {
        case 'Student':
          let Student = db.model(mdName, dschema);
          options = {upsert: true,
                    new:true};
          Student.findOneAndUpdate(conditions, { $set: data}, options, function(err, doc){
             if(err)throw err;
             closingMongo(db,dbS);
            console.log('Item updated');
          });
        break;
      default:

    }
}
let getDocFunction = function(query, projection, mdName, dschema,cb){
  let db = mongoose.createConnection();
  let rdata;
  dschema = new mSchema(dschema);
  db.open(url+dbS);
  switch (mdName) {
      case 'Student':
        dschema.post('find', function(){
          closingMongo(db,dbS);
        });
        let Student = db.model(mdName, dschema);
        Student.find(query, projection,cb);
      break;
    default:

  }
}
let closingMongo = function(db, dbS){
  db.close(function(){
    console.log('Info: Closing connection with mongo DB, con: ', dbS);
  });
}

module.exports = {
  insert: insertFunction,
  update: updateFunction,
  getDoc: getDocFunction
}
