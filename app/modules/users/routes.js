/**
 * Created by sharique on 1/21/16.
 */

var Config = require('../../../config/config');
var prefix = Config.get('/api/prefix');
var Service = Config.get('/api/service');
var User = require('./user');

exports.endpoints = [
  {
    method: 'POST',
    path: prefix + '/{apiVersion}/' + Service,
    config: User.create
  },
  {
    method: 'PUT',
    path: prefix + '/{apiVersion}/' + Service,
    config: User.create
  },
  {
    method: 'POST',
    path: prefix + '/{apiVersion}/' + Service + '/project',
    config: User.create
  }
];