
var mongoose = require('mongoose');

function init(env){
	mongoose.connect(url(env));
	return new Promise((resolve, reject)=>{
		mongoose.connection.once('open', ()=>{
			console.log("DB connected");
			resolve(true);
		});
		mongoose.connection.on('error', (err)=>{
			console.log("DB connection error ");
			throw err;
		});
	});
}

function setupData(){
	return new Promise((resolve, reject)=>{
		console.log("Setting up data");
		resolve();
	});
}

function url(env){
	var config = require('./config')(env);
	return 'mongodb://' + config.hostname + '/' + config.db;
}

module.exports.init = init;
module.exports.setupData = setupData;