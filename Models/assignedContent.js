

module.exports = function(mongoose, dbconn){
  let Schema = mongoose.Schema;
  let assignedContent = new Schema({
      "student_id" 	: {	type: Schema.Types.ObjectId,
						index:true,
						ref:'Student'},
      "description"	: String,
      "content_id" 	: {	type: Schema.Types.ObjectId,
						index:true,
						ref:'Content'}
	  "completed"	: {
						type		:	Boolean,
						default	:	false
					}
    });
    return dbconn.model('AssignedContent', assignedContent, 'AssignedContents');
};
