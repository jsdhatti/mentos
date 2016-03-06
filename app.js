'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var config = require('./config')();
var db = require('./db');

app.use(bodyParser.urlencoded({
	extended: true
}));

const PORT = 3000;
global.rootpath = __dirname;

db.init().then(()=>{
	db.setupData().then(()=>{
		app.listen(PORT, ()=>{
			let env = config.env;
			console.log(`Listening at port ${PORT} on ${env} environement`);



			var WorkFlow = require('./lib/WorkFlow');
			var workFlow = new WorkFlow(rawTasks.workFlow);

			workFlow.on('newtask', (data)=>{
				console.log("newtask: ",data);
			}).on('success', (data)=>{
				console.log("success: ",data);
			}).on('fail', (data)=>{
				console.log("fail: ",data);
			}).on('done', (data)=>{
				console.log("done: ",data);
			}).on('log',(data)=>{
				console.log("logging: ",data);
			});

			workFlow.execute().then((tasks)=>{
				console.log("Build finished ",tasks);
				process.exit(0);
			}, (err)=>{
				console.error("err: ",err);
				console.info('Build failed');
				process.exit(0);
			});
		});
	});
});

