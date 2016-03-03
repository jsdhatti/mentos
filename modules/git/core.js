'use strict';

/*
*
* Input: Git url, username, pwd, folderPath
* Output: success msg, folderPath
*
*/

var BaseTask = require('../../lib/BaseTask');
var shell = require('shelljs');

class GitTask extends BaseTask{
  constructor(name, credentials, opts){
    super(name);
    this.credentials = credentials;
    this.opType = opts.opType;          // Push, Pull, etc
    this.branch = opts.branch || 'master';          // Github, BitBucket, etc
    this.folderPath = opts.folderPath;
  }

  start(){
    switch(this.opType){
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
		if(!shell.which('git'))
      throw new Error('Git is not installed. apt-get install git');

		console.log('Initiating pull');

    // Path changed
    shell.cd(this.folderPath);

		let url = repoUrl(this.credentials);
		let cmd = `git pull ${url} ${this.branch}`;
		console.log('executing cmd: ',cmd);

		shell.exec(cmd, function(code, stdout, stderr) {
			console.log('Exit code:', code);
			console.log('cmd output:', stdout);
			console.log('Program stderr:', stderr);
		});
  }

  clone(){
    console.log('cloning');

    let url = repoUrl(this.credentials);
    let cmd = `git clone ${url}`;
    console.log('executing cmd: ',cmd);

    shell.exec(cmd, function(code, stdout, stderr) {
      console.log('Exit code:', code);
      console.log('cmd output:', stdout);
      console.log('Program stderr:', stderr);
    });
  }

  end(){
    super.end();
  }
}

function repoUrl(creds){
  let url = creds.url.split('@');

	// Check if username is attached
	if(url.length === 1)
		return url.join('');

	// Attached pwd
  url[0] += ':' + creds.password;

  return url.join('@');
}

module.exports = GitTask;