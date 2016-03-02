'use strict';

/*
*
* Input: Git url, username, pwd, folderPath
* Output: success msg, folderPath
*
*/

var BaseTask = require('../../lib/BaseTask');

class GitTask extends BaseTask{
  constructor(name, type, credentials, folderPath){
    super(name);
    this.type = type; // Push, Pull, etc
    this.credentials = credentials;
    this.folderPath = folderPath;
  }
  start(){
    console.log('starting');
    switch(this.type){
      case 'push':
        this.push();
        break;
      case 'pull':
        this.pull();
        break;
    }
  }
  push(){
    console.log('pushing');
  }
  pull(){
    console.log('pulling');
  }
  end(){
    super.end();
  }
}

module.exports = GitTask;