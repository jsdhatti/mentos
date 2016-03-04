'use strict';

const _rootpath = global.rootpath;

var path = require('./path');
var GitTask = require('../modules/git');
var ShellTask = require('../modules/shell');
var NotificationTask = require('../modules/notification');

function create(item){
  var task;
  var type = item.type;
  var props = item.properties;
  if(type === 'git'){
    task = new GitTask(item.id, item.name, {
      username: props.user,
      password: props.pwd
    }, {
      opType: 'pull',
      branch: props.branch,
      folderPath: `${path.stepBack(_rootpath, 1)}/testground`
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