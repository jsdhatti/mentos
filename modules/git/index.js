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
  folderPath: '/home/talha/Talha/Learning/exp/mentos'
});

gitTask.start();

/*
var taskRunner = new TaskRunner();
taskRunner.push(gitTask);
taskRunner.start();
*/
