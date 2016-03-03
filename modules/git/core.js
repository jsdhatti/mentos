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
    this.opType = opts.opType;          // Clone, Pull, etc
    this.branch = opts.branch || 'master';          // Github, BitBucket, etc
    this.folderPath = opts.folderPath;
  }

  start(){
    switch(this.opType){
      case 'clone':
        this.clone();
        break;
      case 'pull':
        this.pull();
        break;
    }
  }

  pull(){
		if(!shell.which('git'))
      throw new Error('Git is not installed. apt-get install git');

		console.log('Initiating pull');

		let _path = this.folderPath;

    // Change path
    shell.cd(_path);

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

		let repoName = this.credentials.url.split('/');
		repoName = repoName[repoName.length - 1].split('.git')[0];
		let _path = `${this.folderPath}/${repoName}`;

		console.log("path: ",_path);

		// Create directory if its not there
		shell.exec(`mkdir -p ${_path}`,()=>{
			shell.cd(_path);

			let url = repoUrl(this.credentials);
			let cmd = `git clone ${url} .`;
			console.log('executing cmd: ',cmd);

			shell.exec(cmd, function(code, stdout, stderr) {
				console.log('Exit code:', code);
				console.log('cmd output:', stdout);
				console.log('Program stderr:', stderr);
			});
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