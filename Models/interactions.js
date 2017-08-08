module.exports = function(mongoose, dbconn){
  let Schema = mongoose.Schema;
  let interactionSchema = new Schema({
      "messenger user id": {type:[String], index:true},
      "student_id": {type: Schema.Types.ObjectId, index:true,ref:'Student'},
      "date": String,
      "text": String});
  return dbconn.model('Interaction',interactionSchema,'Interactions');

};
