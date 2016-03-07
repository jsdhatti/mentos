/**
 * Created by sharique on 3/7/16.
 */

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/', controller.index);
