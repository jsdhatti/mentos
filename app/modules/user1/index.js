/**
 * Created by sharique on 3/7/16.
 */

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

//---- Basic tasks
router.get('/', controller.index);
router.post('/', controller.create);
router.put('/', controller.update);
router.post('/project', controller.addProjectToUser);

//---- Advanced tasks
router.get('/build', controller.executeBuild);
