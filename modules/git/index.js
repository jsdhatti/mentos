'use strict';

var GitTask = require('./core');

var creds = {
  url: 'https://tkhank@bitbucket.org/mentosTeam/mentos.git',
  username: 'tkhank',
  password: 'businessback1'
};

var gitTask = new GitTask('my pull', creds, {
  opType: 'pull',
  repoHost: 'bitbucket',
  branch: 'develop',
  folderPath: '/Users/talhakhan/Talha/Programming/Web-Projects/test'
});

gitTask.start();

/*
var taskRunner = new TaskRunner();
taskRunner.push(gitTask);
taskRunner.start();
*/
