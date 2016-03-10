/**
 * Created by sharique on 3/7/16.
 */

var UserFacade = require('../../facade/user');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

exports.index = index;
exports.create = create;
exports.update = update;
exports.addProjectToUser = addProjectToUser;
exports.executeBuild = executeBuild;

function index(req, res){
  UserFacade.index()
    .then(users=>{
      return res.status(200).send(users);
    }, err=>{
      return res.status(err.output.statusCode).send(err);
    });
}

function create(req, res){
  UserFacade.create(req.body)
    .then(user=>{
      return res.status(200).send(user);
    }, err=>{
      return res.status(err.output.statusCode).send(err);
    });
}

function update(req, res){
  UserFacade.update(req.user.id, req.body)
    .then(user=>{
      return res.status(200).send(user);
    }, err=>{
      return res.status(err.output.statusCode).send(err);
    });
}

function addProjectToUser(req, res){
  UserFacade.addProjectToUser(req.user.id, req.body)
    .then(user=>{
      return res.status(200).send(user);
    }, err=>{
      return res.status(err.output.statusCode).send(err);
    });
}

function executeBuild(req, res){

}

