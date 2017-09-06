

module.exports = function(mongoose, dbconn){
  let Schema = mongoose.Schema;
  let studentSchema = new Schema({
      "first name"			: String,
      "last name"			: String,
      "messenger user id"	: {	type : String,
								index : true},
      "profile pic url"		: String,
      "profileLink"			: String,
      "startDate"			: String,
      "age"					: String,
      "Nationality"			: String,
      "Lives in"			: String,
      "Number of Friends"	: String,
      "studentInfo_id"		:  {
				type: Schema.Types.ObjectId,
				index:true,
				ref:'StudentInfo'
			},
      "Last Interaction" 	: {	text : String,
								date : String}
    });
    return dbconn.model('Student', studentSchema,'Students');
};
