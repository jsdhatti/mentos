/**
 * Created by sharique on 3/7/16.
 */

var Promise = require('bluebird');
var UserModel = require('../modules/user/user.model');
var Joi = require('joi');
var ProjectValidator = require('./validationSchemas/project');
var boom = require('boom');
var _ = require('lodash');

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

function update(id, data){
  return new Promise((resolve, reject)=>{
    UserModel.findByIdAsync(id)
      .then(user => {
        if(!user){
          return reject(boom.notFound('user not found'));
        }
        var updatedUser = _.merge(user, data, (a, b)=>{
          return b;
        });
        updatedUser.saveAsync()
          .then(user=>{
            return resolve(user);
          }, err => {
            return reject(boom.badImplementation());
          });
      }, err => {
        return reject(boom.badImplementation());
      });
  });
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

function addProjectToUser(id, project){
  var result = Joi.validate(project, ProjectValidator);
  if(result.error){
    return Promise.reject(boom.badData('Bad data', result.error.details));
  }
  return UserModel.findByIdAndUpdateAsync(id, {
    $addToSet: {
      projects : project
    }
  }, { new:true });
}