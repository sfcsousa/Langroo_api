let config = {};
config.mongo = {};
config.mongo.db = 'langroo';
config.mongo.port = 27017;
config.mongo.url = 'mongodb://localhost:'+config.mongo.port+'/';

config.google = {};
config.google.spreadsheetId = '10utEusTbOMFvtxeqp8XgpfFiJxv6cYy0aOSdVzAkuTI';
config.google.range = 'Student - DATA2!A2:K';

config.server = {}
config.server.port = 9000;

config.facebook = {
	clientID     : '114144155933069', // your App ID
    clientSecret : '75fac856786c1af48803d81016b558c0', // your App Secret
    callbackURL  : 'http://localhost:'+config.server.port+'/auth/facebook/callback'
};
		

module.exports = config;
