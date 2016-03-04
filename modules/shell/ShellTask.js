'use strict';

var BaseTask = require('./../../lib/BaseTask');
var Shell = require('../../lib/Shell');

class ShellTask extends BaseTask {
  constructor(name,  command){
    super(name);
    this.name = name;
    /*String command like: ls -l | grep ssh*/
    this.command = command;
  }

  start(){
    this.log(`Starting to execute task: ${this.name}.`);
    return Shell.exec(this.command, {silent: true});
  }

  end(){
    super.end();
  }
}

module.exports = ShellTask;