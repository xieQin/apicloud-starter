var des = require('./crypto_des');
var config = require('../../config');

var mypara = {
	get: function(param) {

	},
	post: function(api, param) {
		var time = new Date();

		param.os = config[api]['os'];
		param.token = parseInt(time.getTime()/1000) + '&' + config[api]['token'];

		var para = des.encode(JSON.stringify(param), config[api]['deskey']);

		return para;
	}
}

module.exports = mypara;