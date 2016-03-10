var Confidence  = require('confidence'),
    Package       = require('../../package')
    ;

var criteria = {
    env: process.env.NODE_ENV
};


var config = {
    $meta: 'This file configures the service.',
    version: Package.version,
    port: {
        $filter: 'env',
        production: process.env.PORT,
        test: 9000,
        $default: 5000
    },
    server: {
        debug: {
            $filter: 'env',
            production: false,
            test: false,
            $default: { request: ['error'] }
        },
        connections: {
            routes: {
                security: true,
                cors:{
                    origin:[
                        'http://localhost:3000',
                        'http://127.0.0.1:3000'
                    ]
                }
            }
        }
    },
    api: {
        prefix: '/api',
        version: 'v1',
        service:'users'
    },
    mongoUri: {
        $filter: 'env',
        production: process.env.MONGO_URI,
        test: 'mongodb://localhost:27017/lummox-test',
        $default: 'mongodb://127.0.0.1:27017/lummox'
    },
    jwt: {
        $filter: 'env',
        production: {
            key: process.env.JWT_SECRET,
            expiresIn: 15*60, // 15 mins
            verifyOptions: { algorithms: [ 'HS256' ] }
        },
        $default: {
            key: 'bizboard-azure-hosted-application',
            expiresIn: 4*60*60, // 4 Hours
            verifyOptions: { algorithms: [ 'HS256' ] }
        }
    },
    auth: {
        scopes: ['admin', 'user-{params.userId}'],
        getAll: {
            strategy: 'jwt',
            scope: ['admin']
        },
        getOne: {
            strategy: 'jwt',
            scope: ['admin']
        },
        getMe: {
            strategy: 'jwt',
            scope: ['user']
        },
        create: false,
        update: {
            strategy: 'jwt',
            scope: ['admin']
        },
        delete: {
            strategy: 'jwt',
            scope: ['admin']
        },
        getScopes: {
            strategy: 'jwt',
            scope: ['admin']
        },
        createCategory:{
            strategy: 'jwt',
            scope: ['admin']
        },
        createQuestion:{
            strategy: 'jwt',
            scope: ['admin']
        },
        listQuestion:{
            strategy: 'jwt',
            scope: ['admin']
        },
        getAccessControl:{
            strategy: 'jwt',
            scope: ['user']
        },
        getProjects:{
            strategy: 'jwt',
            scope: ['admin', 'user']
        },
        bothAccess:{
            strategy: 'jwt',
            scope: ['admin', 'professional', 'customer']
        },
        applyProject:{
            strategy: 'jwt',
            scope: ['admin', 'professional']
        }
    },
    saltRounds: 10,
    swaggerOptions: {
        apiVersion: Package.version,
        documentationPath: '/docs/users',
        basePath:'/',
        schemes:['http'],
        labels:[
            'api',
            'user',
            'category',
            'auth'
        ],
        host : 'http://localhost:3000',
        endpoint: '/static/docs/users',
        info : {
            title: 'Bizboard',
            description: 'A user service designed for SOA systems.'
        }
    },
    accessControl:{
        'admin' :['viewCategory', 'createCategory', 'updateCategory', 'viewQuestions', 'createQuestions', 'updateQuestions', 'viewUsers'],
        'profession' : [],
        'customer' : []
    }
};


var store = new Confidence.Store(config);


exports.get = function (key) {
    return store.get(key, criteria);
};


exports.meta = function (key) {
    return store.meta(key, criteria);
};