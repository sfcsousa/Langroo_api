let config = {};

config.mongo.db = 'langroo';
config.mongo.port = 27017;
config.mongo.url = 'mongodb://localhost:'+config.mongo.port+'/';

config.google.spreadsheetId = '10utEusTbOMFvtxeqp8XgpfFiJxv6cYy0aOSdVzAkuTI';
config.google.range = 'Student - DATA2!A2:K';

config.server.port = 9000;
module.exports = config;
