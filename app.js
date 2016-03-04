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

db.init().then(()=>{
	db.setupData().then(()=>{
		app.listen(PORT, ()=>{
			let env = config.env;
			console.log(`Listening at port ${PORT} on ${env} environement`);

			var Noti = require('./modules/notification');
			var notification = new Noti('slack noti', {
				webHook : 'https://hooks.slack.com/services/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',
				slackChannel:'#integration-alert'
			});
			notification.start('Build Initialized')
				.then((response)=>{
					console.log(response.response.statusCode, response.response.body);
				},(err)=>{
					console.error(err);
				});

		});
	});
});

const _rootpath = __dirname;

module.exports.app = app;
module.exports.rootpath = _rootpath;
