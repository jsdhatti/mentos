/**
 * Created by sharique on 3/3/16.
 */

var BaseTask = require('./BaseTask');
var Shell = require('../helper/Shell');

class ShellTask extends BaseTask {
  constructor(name,  command){
    super(name);
    /*String command like: ls -l | grep ssh*/
    this.command = command;
  }


  start(){
    


  }

  end(){
    super.end();
  }

}