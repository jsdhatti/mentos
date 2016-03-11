#!/usr/bin/env node
var program = require('commander');
var cmds = {};

program
	.version('0.0.1')
	.option('-p',"blaaaa")
	.arguments('<cmd>')
	.action(function (cmd) {
		cmds.first = cmd;
	});

program.parse(process.argv);

if (!cmds || !cmds.first) {
	console.error('no command given! Exiting...');
	process.exit(1);
}

if(cmds.first === 'start'){
	console.log("starting mentos....");
}else if(cmds.first === 'stop'){
	console.log("stopping mentos...");
}
