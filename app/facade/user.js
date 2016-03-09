/**
 * Created by sharique on 3/7/16.
 */

var Promise = require('bluebird');
var UserModel = require('../modules/user/user.model');
var Joi = require('joi');
var ProjectValidator = require('./validationSchemas/project');
var boom = require('boom');

exports.index = index;
exports.create = create;
exports.update = update;
exports.delete = remove;
exports.removeAll = removeAll;
exports.addProjectToUser = addProjectToUser;

function create(payload){
  var user = new UserModel(payload);
  return user.saveAsync();
}

function update(query, dataSet){
  return UserModel.findOneAndUpdateAsync(query, dataSet, { new:true });
}

function remove(){
  return UserModel.remove(query);
}

function removeAll(){
  return UserModel.removeAsync({});
}

function index(){
  return UserModel.findAsync({});
}

function addProjectToUser(query, project){
  var result = Joi.validate(project, ProjectValidator);
  if(result.error){
    return Promise.reject(boom.badData('Bad data', result.error.details));
  }
  return UserModel.findOneAndUpdateAsync(query, {
    $addToSet: {
      projects : project
    }
  }, { new:true });
}