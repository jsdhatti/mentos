/**
 * Created by sharique on 3/9/16.
 */

var Joi = require('joi');

module.exports = Joi.object().keys({
  name:Joi.string().max(255).min(1).required(),
  technology:Joi.string().max(255).min(1),
  initialization:Joi.array().items(Joi.object().keys({
    id:Joi.number().required(),
    name : Joi.string().max(255).min(1).required(),
    taskType:Joi.string().required().valid('shell', 'git', 'notification'),
    properties:Joi.object().keys({
      url:Joi.string().required(),
      branch:Joi.string().required(),
      user:Joi.string(),
      pwd:Joi.string(),
      folderPath:Joi.string(),
      opType:Joi.string().when('taskType',{
        is:'git',
        then:Joi.string().required().valid('pull', 'clone')
      }),
      command:Joi.string().when('taskType',{
        is:'shell',
        then:Joi.string().required()
      }),
      webHook:Joi.string().when('taskType',{
        is:'notification',
        then:Joi.string().required()
      }),
      slackChannel:Joi.string().when('taskType',{
        is:'notification',
        then:Joi.string().required()
      }),
      message:Joi.string().when('taskType',{
        is:'notification',
        then:Joi.string().required()
      })
    })
  })),
  workflow : Joi.array().items(Joi.object().keys({
    id:Joi.number().required(),
    name : Joi.string().max(255).min(1).required(),
    taskType:Joi.string().required().valid('shell', 'git', 'notification'),
    properties:Joi.object().keys({
      url:Joi.string().required(),
      branch:Joi.string().required(),
      user:Joi.string(),
      pwd:Joi.string().when('user', {
        is:Joi.string(),
        then:Joi.string().required()
      }),
      path:Joi.string(),
      opType:Joi.string().when('taskType',{
        is:'git',
        then:Joi.string().required().valid('pull', 'clone')
      }),
      command:Joi.string().when('taskType',{
        is:'shell',
        then:Joi.string().required()
      }),
      webHook:Joi.string().when('taskType',{
        is:'notification',
        then:Joi.string().required()
      }),
      slackChannel:Joi.string().when('taskType',{
        is:'notification',
        then:Joi.string().required()
      }),
      message:Joi.string().when('taskType',{
        is:'notification',
        then:Joi.string().required()
      })
    })
  }))
});