/**
 * Created by sharique on 3/7/16.
 */

var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

var projectSchema = mongoose.Schema({
  name:{
    type:String
  },
  technology:{
    type:String
  },
  initialization:[
    {
      id:{
        type:Number
      },
      name:{
        type:String
      },
      taskType:{
        type:String,
        lowercase:true,
        enum:['shell', 'git', 'notification']
      },
      properties:{
        url:{type:String},
        opType:{type:String},
        branch:{type:String},
        user:{type:String},
        pwd:{type:String},
        path:{type:String},
        command:{type:String},
        webHook:{type:String},
        slackChannel:{type:String},
        message:{type:String}
      }
    }
  ],
  workFlow:[
    {
      id:{
        type:Number
      },
      name:{
        type:String
      },
      taskType:{
        type:String,
        lowercase:true
      },
      properties:{
        url:{type:String},
        branch:{type:String},
        user:{type:String},
        pwd:{type:String},
        path:{type:String},
        command:{type:String}
      }
    }
  ],
  builds : []
});

var UserSchema = mongoose.Schema({

  email : {
    type:String,
    lowercase:true,
    required:true
  },
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  role:{
    type:String,
    default:'user'
  },
  password: String,
  salt: String,
  github: {},
  bitbucket:{},
  projects:[projectSchema]
});

module.exports = mongoose.model('User', UserSchema);