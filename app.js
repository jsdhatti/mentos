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

			/*var Noti = require('./modules/notification');
			 var notification = new Noti('slack noti', {
			 webHook : 'https://hooks.slack.com/services/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',
			 slackChannel:'#integration-alert',
			 message : 'Build Initialized'
			 });
			 notification.start();

			 });*/

			var a = {
				_id:'some id',
				workFlow:[
					{
						id:0,
						parent:[],
						name: 'my pull',
						type:'git',
						properties:{
							url:'https://github.com/t-khan-k/angular-listview.git',
							branch:'develop',
							user:'hsmsharique',
							pwd:'hsmsh2912everee'
						}
					},
					{
						id:1,
						parent:[0],
						name: 'my shell1',
						type:'shell',
						properties:{
							command:'npm install',
							path:'' //can be empty
						}
					},
					{
						id:2,
						parent:[0],
						name: 'my shell2',
						type:'shell',
						properties:{
							command:'bower install',
							path:'' //can be empty
						}
					}
				]
			};

			var WorkFlow = require('./lib/WorkFlow');
			var wf = new WorkFlow(a.workFlow);
			wf.on('doorOpen').then((data)=>{
				console.log("open data: ",data);
			});
			wf.on('doorClosed').then((data)=>{
				console.log("close data: ",data);
			});
			wf.execute().then((tasks)=>{
				console.log("Build finished ",tasks);
				process.exit(0)
			}, (err)=>{
				console.error("err: ",err);
				console.info('Build failed');
				process.exit(0)
			});
		});
	});
});

global.rootpath = __dirname;