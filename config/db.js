var Mongoose = require('mongoose'),
    Config = require('./config');

exports.connect = function(criteria){

  Mongoose.connect(Config.get('/mongoUri', criteria));
  var db = Mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error'));
  return db;

};
