/**
 * Created by sharique on 1/21/16.
 */

var UserModel = require('../models/user');
var Boom = require('boom');
var Config = require('../../config/config');
var JWT = require('jsonwebtoken');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var _ = require('lodash');


exports.v1 = {

  test : function(req, reply){
    reply({
      version:'v1.0'
    })
  },

  create : function(payload){

    return new Promise(function(resolve, reject){
      var u = new UserModel.User(payload);
      u.saveAsync()
        .then((user)=>{
          UserModel.User
            .findByIdAsync(user._id, '-salt -hashedPassword -__v -scope')
            .then(user =>{
              return resolve(user);
            }, err=>{
              return handleError(err, reject);
            });
        }, err =>{
          return handleError(err, reject);
        });
    });


  },

  refreshToken:function(payload){

    return new Promise(function(resolve, reject){
      var User = UserModel.User;
      User.findOne({ email: payload.email, active: true }, function(err, user) {
        if(!user) {
          return reject(Boom.unauthorized('Invalid credentials'));
        }

        var isValidPassword = user.checkPassword(payload.password);

        if(!isValidPassword){
          return reject(Boom.unauthorized('Invalid credentials'));
        }

        user.jti = user.generateJti();

        user.save(function(err, u) {
          if (err) {
            return reject(Boom.badImplementation());
          }
          var payload = {
            scope: ['refresh'],
            jti: u.jti
          };
          var opts = { subject: u._id };
          var token = JWT.sign(payload, Config.get('/jwt/key'), opts);
          return reject({ token: token });
        });
      });
    });
  },

  accessToken : function(sub){

    return new Promise(function(resolve, reject){
      var User = UserModel.User;
      User.findOne({ _id: sub, active: true }, function(err, user) {
        if(!user) {
          return reject(Boom.unauthorized('User not found'));
        }

        var payload = {
          scope: _.uniq(_.compact(user.scope.concat(user.role)))
        };

        var opts = {
          subject: user._id,
          expiresIn: Config.get('/jwt/expiresIn')
        };

        var token = JWT.sign(payload, Config.get('/jwt/key'), opts);
        return resolve({
          token: token,
          firstName : user.firstName,
          lastName : user.lastName,
          _id : user._id,
          role : _.uniq(_.compact(user.scope.concat(user.role)))
        });
      });
    });
  },

  getMe : function(subject){
    return new Promise(function(resolve, reject){
      UserModel.User.findById(subject, '-salt -hashedPassword -__v')
        .exec(function(err, user){
          if (err) {
            return reject(Boom.badImplementation());
          }
          if(!user) {
            return reject(Boom.unauthorized('User not found'));
          }
          return resolve(user);
        });
    });
  },

  initializeProject:function(id, project){
    return UserModel.User.findByIdAndUpdateAsync(id, {
      $addToSet: {
        projects : project
      }
    }, { new:true });
  },

  removeAll:function(){
    return UserModel.User.removeAsync({});
  }
};

var handleError = function(err, callback) {
  console.error(err);
  if(err.code === 11000) {
    var field = err.message.match(/email/g);
    return callback(Boom.conflict('Another user already exists with that '+field))
  }
  return callback(Boom.badImplementation());
};
