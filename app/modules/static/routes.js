/**
 * Created by sharique on 1/21/16.
 */

var Static = require('./static');

exports.endpoints = [
  {
    method: 'GET',
    path: '/{something*}',
    config: Static.get
  }
];