var Composer = require('./index');
var db = require('./config/db');

Composer(function (err, server) {
  if (err) {
    throw err;
  }

  db.connect().once('open', function callback() {
    console.log("Connection with database succeeded.");
    server.start(function () {
      console.log('Started the USER service:' + server.info.uri);
    });
  });
});
