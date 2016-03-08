/**
 * Created by sharique on 3/7/16.
 */

var Promise = require('bluebird');
var UserModel = require('../modules/user/user.model');

exports.index = index;
exports.create = create;
exports.update = update;
exports.delete = remove;
exports.find = find;
exports.removeAll = removeAll;
exports.addProjectToUser = addProjectToUser;

function create(payload){
  var user = new UserModel(payload);
  return user.saveAsync();
}

function update(payload){


}

function remove(){

}

function removeAll(){
  return UserModel.removeAsync({});
}

function index(){
  return UserModel.findAsync({role : { $ne : 'admin' }});
}

function find(opts){

}

function addProjectToUser(query, project){

  return UserModel.findOneAndUpdateAsync(query, {
    $addToSet: {
      projects : project
    }
  }, { new:true });

}