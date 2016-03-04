'use strict';

var BaseTask = require('../../lib/BaseTask');
var request = require('request');

class NotificationTask extends BaseTask {
    constructor(name, opts){
        super(name);
        this.name = name;
        this.webHook = opts.webHook;
        this.slackChannel = opts.slackChannel;
    }

    start(message){
        return new Promise((resolve, reject)=> {
            this.log(`Starting to execute task: ${this.name}.`);
            if(!message){
                return reject(new Error('No text specified'));
            }
            let postData = {
                channel : this.slackChannel,
                username : 'Mentos',
                text : message,
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