module.exports = function(mongoose, dbconn){
  let Schema = mongoose.Schema;
  let studentFB = new Schema({
      "messenger user id"	: {type:[String], index:true},
      "student_id"			: {type: Schema.Types.ObjectId, index:true,ref:'Student'},
      "token"				: String,
	  "profile_id"			: String,
	  "email"				: String,
	  "_link"				: String
    });
    return dbconn.model('StudentFB', studentFB,'StudentFBinfos');
};
