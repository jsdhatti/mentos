'use strict';

var GitTask = require('./core');
var creds = {
  url: '',
  username: '',
  pwd: ''
};
var gitTask = new GitTask('my pull', 'pull', creds, '/Users/talhakhan/Talha/Programming/Web-Projects/git-test');
gitTask.start();
gitTask.end();