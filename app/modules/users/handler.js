/**
 * Created by sharique on 1/29/16.
 */

var UserFacade = require('../../facade/users');
var v1 = {};


exports.v1 = v1;

v1.createUser = function(request, reply){

  UserFacade.v1.create(request.payload)
    .then(user=>{
      reply(user);
    }, err=>{
      reply(err);
    })

};

v1.tokenRefresh = function(request, reply){

  UserFacade.v1.refreshToken(request.payload)
    .then(user=>{
      reply(user);
    }, err=>{
      reply(err);
    })

};

v1.tokenAccess = function(request, reply){

  UserFacade.v1.accessToken(request.auth.credentials.sub)
    .then(user=>{
      reply(user);
    }, err=>{
      reply(err);
    })
};

v1.getMe = function(request, reply){
  UserFacade.v1.getMe(request.auth.credentials.sub)
    .then(user=>{
      reply(user);
    }, err=>{
      reply(err);
    })
};

v1.initializeProject = function(request, reply){

  UserFacade.v1
    .initializeProject(request.auth.credentials.sub, request.payload)
    .then(user=>{
      reply(user);
    }, err=>{
      reply(err);
    })

};
