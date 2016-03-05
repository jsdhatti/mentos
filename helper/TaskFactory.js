'use strict';

const _rootpath = global.rootpath;

var path = require('./path');
var GitTask = require('../lib/GitTask');
var ShellTask = require('../lib/ShellTask');
var NotificationTask = require('../lib/NotificationTask');

function create(item){
  var task;
  var type = item.type;
  var props = item.properties;
  if(type === 'git'){
    task = new GitTask(item.id, item.name, {
      username: props.user,
      password: props.pwd
    }, {
			url: props.url,
      opType: 'pull',
      branch: props.branch,
      folderPath: `${path.stepBack(_rootpath, 1)}/testground/angular-listview`
    });
  }else if(type === 'shell'){
    task = new ShellTask(item.id, item.name , props.command);
  }else if(type === 'notification'){
    task = new NotificationTask(item.id, item.name, {
      webHook : 'https://hooks.slack.com/services/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',
      slackChannel:'#integration-alert',
      message : 'Build Initialized'
    });
  }
  return task;
}

module.exports.create = create;