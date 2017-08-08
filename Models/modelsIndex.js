module.exports = function(mongoose,dbconn){
    return {
      student : require("./student")(mongoose,dbconn),
      interaction : require("./interactions")(mongoose,dbconn),
      studentInfo: require("./studentInfo")(mongoose,dbconn)
    };
};
