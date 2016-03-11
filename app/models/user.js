var crypto = require('crypto');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

function toLower (v) {
    return v.toLowerCase();
}

var projectSchema = mongoose.Schema({
    name:{
        type:String
    },
    technology:{
        type:String
    },
    initialization:[
        {
            id:{
                type:Number
            },
            name:{
                type:String
            },
            taskType:{
                type:String,
                lowercase:true,
                enum:['shell', 'git', 'notification']
            },
            properties:{
                url:{type:String},
                opType:{type:String},
                branch:{type:String},
                user:{type:String},
                pwd:{type:String},
                path:{type:String},
                command:{type:String},
                webHook:{type:String},
                slackChannel:{type:String},
                message:{type:String}
            }
        }
    ],
    workFlow:[
        {
            id:{
                type:Number
            },
            name:{
                type:String
            },
            taskType:{
                type:String,
                lowercase:true
            },
            properties:{
                url:{type:String},
                branch:{type:String},
                user:{type:String},
                pwd:{type:String},
                path:{type:String},
                command:{type:String}
            }
        }
    ],
    builds : []
});

var UserSchema = mongoose.Schema({

    email : {
        type:String,
        lowercase:true,
        required:true
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    role:{
        type:String,
        default:'user'
    },
    hashedPassword:{
        type:String
    },
    salt:{
        type:String
    },
    github: {},
    bitbucket:{},
    projects:[projectSchema]
},{ timestamps: true });

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function(next) {
        if (!this.isNew) return next();

        if (!validatePresenceOf(this.hashedPassword))
            next(new Error('Invalid password'));
        else
            next();
    });

UserSchema.methods = {
    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt : function(){
        return crypto.randomBytes(16).toString('base64');
    },
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    checkPassword : function(plainText){
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword : function(password){
        if (!password || !this.salt) return '';
        else if(password.length < 8 || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    },

    generateJti : function(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
};

var validatePresenceOf = function(value) {
    return value && value.length;
};

var user = mongoose.model('User', UserSchema);

module.exports = { User : user };