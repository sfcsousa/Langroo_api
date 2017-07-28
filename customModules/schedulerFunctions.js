let scheduler = require('node-schedule');

let defineScheduler = function(date_rule: String , cb){
    let jobS = schedule.scheduleJob(date_rule , cb);
}

module.exports.schedule = defineScheduler;
