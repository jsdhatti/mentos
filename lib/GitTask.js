'use strict';

/*
 *
 * Input: Git url, username, pwd, folderPath
 * Output: success msg, folderPath
 *
 */

var BaseTask = require('./BaseTask');
var Shell = require('./Shell');

class GitTask extends BaseTask{
  constructor(id, name, credentials, opts){
    super(id, name, opts);
    this.credentials = credentials;
    this.url = opts.url;                      // Clone, Pull, etc
    this.opType = opts.repo;                      // Clone, Pull, etc
    this.opType = opts.opType;                      // Clone, Pull, etc
    this.branch = opts.branch || 'master';          // Github, BitBucket, etc
    this.folderPath = opts.folderPath;
  }

  start(){
    super.start();
    if(this.opType == 'clone'){
      return this.clone();
    }else if(this.opType == 'pull'){
      return this.pull();
    }
  }

  pull(){
    if(!Shell.cmd().which('git'))
      throw new Error('Git is not installed. apt-get install git');

    this.log(`Initiating pull`, 'info', true);
    this.log(`test`, 'error');

    let _path = this.folderPath;

    // Change path
    Shell.cmd().cd(_path);

    let url = repoUrl(this.url, this.credentials);
    let cmd = `git pull ${url} ${this.branch}`;

    return Shell.exec(cmd)
      .then((result)=>{
      });
  }

  clone(){

    this.log('cloning');

    let repoName = this.url.split('/');
    repoName = repoName[repoName.length - 1].split('.git')[0];
    let _path = `${this.folderPath}/${repoName}`;

    this.log(`${_path}`);

    // Create directory if its not there
    return Shell.exec(`mkdir -p ${_path}`)
      .then(()=>{
        Shell.cmd().cd(_path);

        let url = repoUrl(this.url, this.credentials);
        let cmd = `git clone ${url} .`;

        return Shell.exec(cmd)
          .then((result)=>{
            this.log(`cmd output: ${result.output}`);
          });
      });
  }

  end(){
    super.end();
  }
}

function repoUrl(url, creds){
  url = url.split('@');

  // Check if username is attached
  if(url.length === 1)
    return url.join('');

  // Attached pwd
  url[0] += ':' + creds.password;

  return url.join('@');
}

module.exports = GitTask;