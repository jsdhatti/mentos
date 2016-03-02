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
		});
	});
});