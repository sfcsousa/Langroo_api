module.exports = function(mongoose,dbconn){
    return {
      student : require("./student")(mongoose,dbconn),
      interaction : require("./interactions")(mongoose,dbconn),
      studentInfo: require("./studentInfo")(mongoose,dbconn),
      studentFB: require("./studentFB")(mongoose,dbconn),
	  content: require('./content')(mongoose, dbconn),
	  assignedContent: require('./assignedContent')(mongoose, dbconn),
    };
};
