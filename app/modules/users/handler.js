/**
 * Created by sharique on 1/29/16.
 */

var UserFacade = require('../../facade/users-bb');
var v1 = {};


exports.v1 = v1;

v1.createUser = function(request, reply){

  UserFacade.v1.create(request.payload)
    .then(function(response){
      reply(response);
    }, function(err){
      reply(err);
    });

};

v1.tokenRefresh = function(request, reply){

  UserFacade.v1.refreshToken(request.payload)
    .then(function(response){
      reply(response);
    }, function(err){
      reply(err);
    });

};

v1.tokenAccess = function(request, reply){

  UserFacade.v1.accessToken(request.auth.credentials.sub)
    .then(function(response){
      reply(response);
    }, function(err){
      reply(err);
    });
};

v1.getMe = function(request, reply){
  UserFacade.v1.getMe(request.auth.credentials.sub)
    .then(function(response){
      reply(response);
    }, function(err){
      reply(err);
    });
};

v1.getUsersByIdOfProject = function(request, reply){

  var options = {
    id : request.auth.credentials.sub,
    project : request.query.project
  };

  ProjectFacade.v1.getApplicantOfProject(options)
    .then(UserFacade.v1.getUsersByIdOfProject)
    .then(function(response){
      reply(response);
    }, function(err){
      reply(err);
    })
    .catch(function(err){
      reply(err);
    });



};
