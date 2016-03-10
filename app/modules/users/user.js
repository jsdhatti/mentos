var Joi = require('joi'),
  Boom = require('boom'),
  //User = require('../../facade/users'),
  Config = require('../../../config/config'),
  Handler = require('./handler');
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
            apiVersion : Joi.string().valid(['v1']).description('api version')
        },
        payload: {
            email: Joi.string().email().required().description('A valid email address'),
            password: Joi.string().min(8).required().description('A password. Must be at least 8 characters'),
            active: Joi.boolean()
              .description('A flag to see if the user is active.')
              .default(false),
            firstName: Joi.string()
              .required()
              .description('First Name is required'),
            lastName: Joi.string()
              .required()
              .description('Last Name is required'),
            role: Joi.string()
              .required().valid('professional'),
            category:Joi.array()
              .required()
              .min(1)
              .items(Joi.string().required().min(24).max(24)),
            subCategory:Joi.array()
              .required()
              .min(1)
              .items(Joi.object().keys({
                  parent : Joi.string()
                    .required()
                    .min(24)
                    .max(24),
                  category : Joi.string()
                    .required()
                    .min(24)
                    .max(24)
              })),
            dob:Joi.date().iso().required().max('now'),
            workPreferences : Joi.object().required().keys({
                preferences : Joi.object().required().keys({
                    toMe : Joi.boolean().required(),
                    toCustomer : Joi.boolean().required()
                }),
                location : Joi.object().required().keys({
                    city:Joi.string().required().min(1).max(50),
                    area:Joi.string().required().min(1).max(100),
                    street:Joi.string().required().min(1).max(100),
                    nearestLandMark:Joi.string().min(1).max(100),
                    latitude:Joi.number().required(),
                    longitude:Joi.number().required()
                }),
                travelLimit:Joi.object().keys({
                    limit:Joi.number(),
                    unit:Joi.string().uppercase().max(3).default('KM')
                })
            })
        }
    },
    handler: {
        versioned: {
            "v1.0": Handler.v1.createUser
        }
    }
};

exports.createCustomer = {
    description: 'Create a customer user',
    notes: 'Create a customer type of user',
    tags: ['api'],
    auth: Config.get('/auth/create'),
    validate: {
        params:{
            apiVersion : Joi.string().valid('v1').description('api version')
        },
        payload: {
            email: Joi.string().email().required().description('A valid email address'),
            password: Joi.string().min(8).required().description('A password. Must be at least 8 characters'),
            firstName: Joi.string()
              .required()
              .description('First Name is required'),
            role: Joi.string()
              .required().valid('customer'),
            lastName: Joi.string()
              .required()
              .description('Last Name is required'),
            dob:Joi.date().iso().required().max('now')
        }
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

exports.accessControlList = {
    description: 'Get access control list',
    notes: 'Get access control list',
    tags: ['api'],
    auth: Config.get('/auth/getAccessControl'),
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
    handler: function(request, reply) {
        reply(Config.get('/accessControl'));
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

exports.getUsersByIdOfProject = {
    description: 'Returns user details of provided project id',
    notes: 'Returns user details of provided project id',
    tags: ['api'],
    auth: Config.get('/auth/bothAccess'),
    validate:{
        headers:Joi.object({
            Authorization :Joi.string()
                .default('XXXXXXX')
                .description('Api token')
                .example('XXXXXXX')
        }).options({ allowUnknown: true }),
        params:{
            apiVersion : Joi.string().valid(['v1']).description('api version')
        },
        query : Joi.object().keys({
            project : Joi.string().required().min(24).max(24)
        })
    },
    handler: {
        versioned:{
            "v1.0" : Handler.v1.getUsersByIdOfProject
        }
    }
};

/*exports.update = {
    description: 'Update a user',
    notes: 'Returns an updated user',
    tags: ['api'],
    auth: Config.get('/auth/update'),
    handler: function(request, reply) {
        var User = UserModel.User;
        User.findOne({ _id: request.params.userId }, function(err, user) {
            if(err) return handleError(err, reply);
            if(!user) {
                return reply(Boom.notFound('No user found for that id'));
            }
            user.username = request.payload.username;
            user.email = request.payload.email;
            if(request.payload.password) {
                user.password = request.payload.password;
            }
            user.scope = request.payload.scope;
            user.active = request.payload.active;
            user.save(function(err, user) {
                if (err) return handleError(err, reply);
                return reply(user);
            });
        });
    }
};*/

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
