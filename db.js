
var mongoose = require('mongoose');

function init(){
	mongoose.connect(url());
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

function url(){
	var config = require('./config')();
	return 'mongodb://' + config.hostname + '/' + config.db;
}

module.exports.init = init;
module.exports.setupData = setupData;