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

			//var git = require('./modules/git/index');
			require('./modules/shell')('cd helper')
				.then((response) => {
					require('./modules/shell')('dir helper')
						.then((response) => {
							console.log(response);
						}, (err) =>{
							console.error(err);
						});
				}, (err) =>{
					console.error(err);
				});
		});
	});
});