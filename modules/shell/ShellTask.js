'use strict';

var BaseTask = require('./../../lib/BaseTask');
var Shell = require('../../lib/Shell');

class ShellTask extends BaseTask {
  constructor(id, name,  command, opts){
    super(id, name);
    this.name = name;
    /*String command like: ls -l | grep ssh*/
    this.command = command;
    this.opts = opts;
  }

  start(){
    super.start();
    this.log(`Starting to execute task: ${this.name}.`);
    return Shell.exec(this.command, {silent: true}, this.opts.path || '');
  }

  end(){
    super.end();
  }
}

module.exports = ShellTask;