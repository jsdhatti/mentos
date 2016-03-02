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
    this.repoHost = opts.repoHost;      // Github, BitBucket, etc
    this.branch = opts.branch;          // Github, BitBucket, etc
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

    // Path changed
    shell.cd(this.folderPath);

    // Check if cloned
    let isCloned = (shell.exec('ls -a | grep .git', {silent:true}).stdout)? true : false;

    switch(this.repoHost){
      case 'github':
        if(isCloned)
          this.pullGithub();
        else
          this.cloneGithub();
        break;
      case 'bitbucket':
        if(isCloned)
          this.pullBitbucket();
        else
          this.cloneBitbucket();
        break;
    }
  }

  pullGithub(){

  }

  cloneGithub(){

  }

  pullBitbucket(){
    console.log('pulling');

    let url = bitbucketUrl(this.credentials);
    let cmd = `git pull ${url} ${this.branch}`;
    console.log('executing cmd: ',cmd);

    shell.exec(cmd, function(code, stdout, stderr) {
      console.log('Exit code:', code);
      console.log('cmd output:', stdout);
      console.log('Program stderr:', stderr);
    });
  }

  cloneBitbucket(){
    console.log('cloning');

    let url = bitbucketUrl(this.credentials);
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

function bitbucketUrl(creds){
  let url = creds.url.split('@');
  url[0] += ':' + creds.password;
  return url.join('@');
}

module.exports = GitTask;