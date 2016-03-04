'use strict';

/*
*
* Input: Git url, username, pwd, folderPath
* Output: success msg, folderPath
*
*/

var BaseTask = require('../../lib/BaseTask');
var Shell = require('../../lib/Shell');

class GitTask extends BaseTask{
  constructor(name, credentials, opts){
    super(name);
    this.credentials = credentials;
    this.opType = opts.opType;                      // Clone, Pull, etc
    this.branch = opts.branch || 'master';          // Github, BitBucket, etc
    this.folderPath = opts.folderPath;
  }

  start(){
    if(this.opType == 'clone'){
      this.clone();
    }else if(this.opType == 'pull'){
      this.pull();
    }
  }

  pull(){
		if(!Shell.cmd().which('git'))
      throw new Error('Git is not installed. apt-get install git');

		console.log('Initiating pull');

		let _path = this.folderPath;

    // Change path
    Shell.cmd().cd(_path);

		let url = repoUrl(this.credentials);
		let cmd = `git pull ${url} ${this.branch}`;
		console.log(`executing cmd ${cmd} \n in pwd ${Shell.cmd().pwd()}`);

		Shell.exec(cmd)
      .then((result)=>{
        console.log('Exit code:', result.code);
        console.log('cmd output:', result.out);
      });
  }

  clone(){
		this.log('cloning');

		let repoName = this.credentials.url.split('/');
		repoName = repoName[repoName.length - 1].split('.git')[0];
		let _path = `${this.folderPath}/${repoName}`;

		this.log(`${_path}`);

		// Create directory if its not there
		Shell.exec(`mkdir -p ${_path}`)
      .then(()=>{
        Shell.cmd().cd(_path);

        let url = repoUrl(this.credentials);
        let cmd = `git clone ${url} .`;
        console.log('executing cmd: ',cmd);

        Shell.exec(cmd)
          .then((result)=>{
            console.log('Exit code:', result.code);
            console.log('cmd output:', result.output);
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