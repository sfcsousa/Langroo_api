module.exports = function(mongoose, dbconn){
  let Schema = mongoose.Schema;
  let interactionSchema = new Schema({
      "messenger user id": {type:[String], index:true},
      "student_id": {type: Schema.Types.ObjectId, index:true,ref:'Student'},
      "chatFuel_block_id": String,
      "chatFuel_block_name": String,
      "date": String,
      "text": String});
  return dbconn.model('Interaction',interactionSchema,'Interactions');

};
