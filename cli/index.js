#!/usr/bin/env node
'use strict';

const program = require('commander');
const colors = require('colors');
const cli = require('require-all')(__dirname + '/lib');
const os = require('os');
var command;

program
	.version('0.0.1')
	.option('-f, --force', 'force setup')
	.arguments('<cmd>')
	.action(function (cmd) {
		command = cmd;
	});

program.parse(process.argv);

if (!command) {
  console.log('no command entered..exiting....'.red);
  process.exit(1);
}else if(command === 'setup'){

  let dependencies = (os.type() === 'Darwin')? require('./dependency_osx.json') : require('./dependency.json');
  cli.setup(dependencies, program.force);

}else if(command === 'start'){

  cli.start();

}else if(command === 'restart'){

  cli.restart();

}else if(command === 'stop'){

  cli.stop();

}else{
  console.log('command not supported..exiting....'.red);
  process.exit(1);
}
