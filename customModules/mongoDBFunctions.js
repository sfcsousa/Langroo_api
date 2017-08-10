
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let assert = require('assert');
let config = require('../Controllers/config');
var url = config.mongo.url;

module.exports.insertRowMongo = function(doc, collection, dtbase, select){

	MongoClient.connect(url+dtbase, function(err, db) {
	  if (err) throw err;
	  db.collection(collection).find(select).toArray(function(err,docs){
			if (docs.length > 0 ){
				doc.myDate = doc.startDate;
				delete doc.startDate;
			  db.collection(collection).update(
				select,
				{$set :  doc	},
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
