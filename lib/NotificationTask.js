'use strict';

var BaseTask = require('./BaseTask');
var request = require('request');

class NotificationTask extends BaseTask {
  constructor(id, name, opts){
    super(id, name);
    this.name = name;
    this.webHook = opts.webHook;
    this.slackChannel = opts.slackChannel;
    if(!message){
      throw new Error('No text specified');
    }
    this.message = opts.message;
  }

  start(message){
    super.start();
    return new Promise((resolve, reject)=> {
      this.log(`Starting to execute task: ${this.name}.`);
      let postData = {
        channel : this.slackChannel,
        username : 'Mentos',
        text : this.message,
        icon_emoji:':ghost:'
      };
      request({
        method : 'POST',
        body : postData,
        json:true,
        url : this.webHook
      }, function(err, response, body){
        if(err){
          return reject(err);
        }
        return resolve({response:response, body:body});
      });
    });
  }

  end(){
    super.end();
  }

}

module.exports = NotificationTask;