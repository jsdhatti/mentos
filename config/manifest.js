var Confidence = require('confidence'),
  Config = require('./config');

var criteria = {
  env: process.env.NODE_ENV
};

function prepareManifestAccordingToCriteria(crit){
  return {
    $meta: 'This file defines the service.',
    server: Config.get('/server', criteria.env || crit),
    connections: [{
      port: Config.get('/port', criteria.env || crit),
      routes:Config.get('/server/connection/routes', criteria.env || crit)
    }],
    plugins: {
      'inert': {},
      'vision': {},
      'hapi-swagger': Config.get('/swaggerOptions', criteria.env || crit),
      'hapi-auth-jwt2': {},
      './auth': {
        key: Config.get('/jwt/key', criteria.env || crit),
        verifyOptions: Config.get('/jwt/verifyOptions', criteria.env || crit)
      },
      'consistency':{
        uriParam: 'apiVersion',
        customHeaderKey: 'api-version'
      },
      './app/modules/users':{}
    }
  };
}


exports.get = function (key, criteria) {
  var store = new Confidence.Store(prepareManifestAccordingToCriteria(criteria));
  return store.get(key, criteria);
};

exports.meta = function (key, criteria) {
  var store = new Confidence.Store(prepareManifestAccordingToCriteria(criteria));
  return store.meta(key, criteria);
};
