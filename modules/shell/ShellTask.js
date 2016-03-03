'use strict';

var BaseTask = require('./../../lib/BaseTask');
var Shell = require('../../helper/Shell');

class ShellTask extends BaseTask {
  constructor(name,  command){
    super(name);
    this.name = name;
    /*String command like: ls -l | grep ssh*/
    this.command = command;
  }

  start(){
    return new Promise((resolve, reject)=>{
			this.log(`Starting to execute task: ${this.name}.`);
			Shell.cmd().exec(this.command, {silent: true}, (code, stdout, stderr)=>{
				console.log(code);
				console.log("out",stdout);
				console.error("err",stderr);
				resolve(stdout);
			});
		});
  }

  end(){
    super.end();
  }
}

module.exports = ShellTask;