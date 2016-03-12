#!/usr/bin/env node
'use strict';

var program = require('commander');
var colors = require('colors');
var cli = require('require-all')(__dirname + '/lib');
let dependencies = require('./dependency.json');
var command;

program
	.version('0.0.1')
	.option('-p',"blaa")
	.arguments('<cmd>')
	.action(function (cmd) {
		command = cmd;
	});

program.parse(process.argv);

if (!command) {
  console.log('no command entered..exiting....'.red);
  process.exit(1);
}else if(command === 'setup'){
  cli.setup(dependencies);
}else if(command === 'start'){
  cli.start();
}else if(command === 'stop'){
  cli.stop();
}else{
  console.log('command not supported..exiting....'.red);
  process.exit(1);
}
