'use strict';

var GitTask = require('./GitTask');
var _rootPath = require('../../app').rootpath;
var path = require('../../helper/path');

var creds = {
  url: 'https://github.com/t-khan-k/angular-listview.git',
  username: 'tkhank',
  password: 'businessback1'
};

var gitTask = new GitTask('my pull', creds, {
  opType: 'clone',
  repoHost: 'bitbucket',
  branch: 'develop',
  folderPath: `${path.stepBack(_rootPath, 1)}/testground`
});


gitTask.start();

/*
var taskRunner = new TaskRunner();
taskRunner.push(gitTask);
taskRunner.start();
*/
