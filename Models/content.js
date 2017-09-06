

module.exports = function(mongoose, dbconn){
  let Schema = mongoose.Schema;
  let contentSchema = new Schema({
      "link": String,
      "description": String,
      "tags": {type:[String], lowercase: true},
      "level": String
    });
    return dbconn.model('Content', contentSchema,'Contents');
};
