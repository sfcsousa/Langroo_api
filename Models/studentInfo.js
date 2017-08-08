module.exports = function(mongoose, dbconn){
  let Schema = mongoose.Schema;
  let studentInfoSchema = new Schema({
      "messenger user id": {type:[String], index:true},
      "student_id": {type: Schema.Types.ObjectId, index:true,ref:'Student'},
      "language School": String,
      "userMotivation": String,
      "userLevel": String,
      "userHearAboutUs": String
    });
    return dbconn.model('StudentInfo', studentInfoSchema,'StudentInfos');
};
