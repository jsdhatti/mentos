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
        path: prefix + '/{apiVersion}/' + Service + '/pro',
        config: User.create
    },
    {
        method: 'POST',
        path: prefix + '/{apiVersion}/' + Service + '/customer',
        config: User.createCustomer
    },
    {
        method: 'POST',
        path: prefix + '/{apiVersion}/' + Service + '/token/refresh',
        config: User.tokenRefresh
    },
    {
        method: 'POST',
        path: prefix + '/{apiVersion}/' + Service + '/token/access',
        config: User.tokenAccess
    },
    {
        method: 'GET',
        path: prefix + '/{apiVersion}/' + Service + '/acl',
        config: User.accessControlList
    },
    {
        method: 'GET',
        path: prefix + '/{apiVersion}/' + Service + '/me',
        config: User.getMe
    },
    {
        method: 'GET',
        path: prefix + '/{apiVersion}/' + Service,
        config: User.getUsersByIdOfProject
    }


];