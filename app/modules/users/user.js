var Joi = require('joi'),
  Boom = require('boom'),
  Validate = require('./validate'),
//User = require('../../facade/users'),
  Config = require('../../../config/config'),
  Handler = require('./handler'),
  UserModel = require('../../models/user');

var handleError = function(err, callback) {
    if(err.code === 11000) {
        var field = err.message.match(/email/g) || err.message.match(/username/g);
        return callback(Boom.conflict('Another user already exists with that '+field))
    }
    return callback(Boom.badImplementation());
};

exports.getAll = {
    description: 'Get all users',
    notes: 'Returns a list of all system users',
    tags: ['api'],
    auth: Config.get('/auth/getAll'),
    validate:{
        headers:Joi.object({
            Authorization :Joi.string()
              .default('XXXXXXX')
              .description('Api token')
              .example('XXXXXXX')
        }).options({ allowUnknown: true }),
        params:{
            apiVersion : Joi.string().valid(['v1']).description('api version')
        }
    },
    handler: function (request, reply) {
        var User = UserModel.User;
        User.find({}, function (err, user) {
            if (err) return handleError(err, reply);
            return reply(user);
        });
    }
};

exports.getOne = {
    description: 'Get a user',
    notes: 'Returns an individual user',
    tags: ['api'],
    auth: Config.get('/auth/getOne'),
    validate:{
        headers:Joi.object({
            Authorization :Joi.string()
              .default('XXXXXXX')
              .description('Api token')
              .example('XXXXXXX')
        }).options({ allowUnknown: true }),
        params:{
            apiVersion : Joi.string().valid(['v1']).description('api version')
        }
    },
    handler: function (request, reply) {
        var User = UserModel.User;
        User.findOne({ _id: request.params.userId }, function (err, user) {
            if (err) return handleError(err, reply);
            if(!user) {
                return reply(Boom.notFound('No user found for that id'));
            }
            return reply(user);
        });
    }
};

exports.create = {
    description: 'Create a user',
    notes: 'Create a single user',
    tags: ['api'],
    auth: Config.get('/auth/create'),
    validate: {
        params:{
            apiVersion: Joi.string()
              .valid('v1').required()
              .description('api version')
        },
        payload: Validate.createUser
    },
    handler: {
        versioned: {
            "v1.0": Handler.v1.createUser
        }
    }
};

exports.createProject = {
    description: 'Create a single project for a user',
    notes: 'Create a single project for a user with initialization and workflow',
    tags: ['api'],
    auth: Config.get('/auth/createProject'),
    validate: {
        params: {
            apiVersion: Joi.string()
              .valid('v1').required()
              .description('api version')
        },
        payload: Validate.projects
    },
    handler: {
        versioned: {
            "v1.0": Handler.v1.createUser
        }
    }
};

exports.tokenRefresh = {
    description: 'Creates user\'s refresh token ',
    notes: 'Create refresh token',
    tags: ['api'],
    validate:{
        params:{
            apiVersion : Joi.string().valid(['v1']).description('api version')
        },
        payload : {
            email : Joi.string().email().required().description('A valid email address'),
            password: Joi.string().min(8).required().description('A password. Must be at least 8 characters')
        }
    },
    handler:{
        versioned:{
            "v1.0": Handler.v1.tokenRefresh
        }
    }

};

exports.tokenAccess = {
    description: 'Generate users access token',
    notes: 'Generate access token',
    tags: ['api'],
    auth: {
        strategy: 'jwt-refresh',
        scope: ['refresh']
    },
    validate:{
        headers:Joi.object({
            Authorization :Joi.string()
              .default('XXXXXXX')
              .description('Api token')
              .example('XXXXXXX')
        }).options({ allowUnknown: true }),
        params:{
            apiVersion : Joi.string().valid('v1').description('api version')
        }
    },
    handler:{
        versioned:{
            "v1.0": Handler.v1.tokenAccess
        }
    }
};

exports.getMe = {
    description: 'Returns user object',
    notes: 'Returns user object from token',
    tags: ['api'],
    auth: Config.get('/auth/getMe'),
    validate:{
        headers:Joi.object({
            Authorization :Joi.string()
              .default('XXXXXXX')
              .description('Api token')
              .example('XXXXXXX')
        }).options({ allowUnknown: true }),
        params:{
            apiVersion : Joi.string().valid(['v1']).description('api version')
        }
    },
    handler: {
        versioned:{
            "v1.0" : Handler.v1.getMe
        }
    }
};


exports.update = {
    description: 'Update a user',
    notes: 'Returns an updated user',
    tags: ['api'],
    auth: Config.get('/auth/update'),
    validate: {
        params: {
            apiVersion: Joi.string()
              .valid('v1').required()
              .description('api version')
        },
        payload: Validate.createUser
    },
    handler: {
        versioned: {
            "v1.0": Handler.v1.ups
        }
    }
};

/*exports.delete = {
 description: 'Remove a user',
 notes: 'Returns a user deleted message',
 tags: ['api'],
 auth: Config.get('/auth/delete'),
 handler: function(request, reply) {

 var User = UserModel.User;
 User.findOne({ _id: request.params.userId }, function(err, user) {
 if(err) return handleError(err, reply);
 if(!user) {
 return reply(Boom.notFound('No user found for that id'));
 }
 user.remove(function(err, user) {
 if(err) return handleError(err, reply);
 return reply({ message: 'User was successfully deleted' });
 });
 });
 }
 };*/

/*exports.getScopes = {
 description: 'Get user scopes',
 notes: 'Returns an array of configured user scopes',
 tags: ['api'],
 auth: Config.get('/auth/getScopes'),
 handler: function(request, reply) {
 reply(Config.get('/auth/scopes'));
 }
 };*/
