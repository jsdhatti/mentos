/**
 * Created by sharique on 3/7/16.
 */

var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

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
  projects:[
    {
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
          type:{
            type:String,
            lowercase:true,
            enum:['shell', 'git', 'notification']
          },
          properties:{
            url:String,
            branch:String,
            user:String,
            pwd:String,
            path:String,
            command:String,
            webHook:String,
            slackChannel:String,
            message:String
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
          type:{
            type:String,
            lowercase:true
          },
          properties:{
            url:String,
            branch:String,
            user:String,
            pwd:String,
            path:String,
            command:String
          }
        }
      ],
      builds : []
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);