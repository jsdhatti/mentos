/**
 * Created by sharique on 3/7/16.
 */

var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var UserModel = require('../modules/user/user.model');