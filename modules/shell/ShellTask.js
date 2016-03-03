/**
 * Created by sharique on 3/3/16.
 */

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
    this.log(`Starting to execute task: ${this.name}.`);
    Shell.cmd().exec(this.command);
  }

  end(){
    super.end();
  }
}

module.exports = ShellTask;