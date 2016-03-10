var crypto = require('crypto');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

function toLower (v) {
    return v.toLowerCase();
}

var UserSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        set: toLower
    },
    hashedPassword:{
        type:String
    },
    salt:{
      type:String
    },
    jti: {
        type: String
    },
    scope: {
        type: Array,
        default:['user']
    },
    role:{
        type:String
    },
    active: {
        type: Boolean,
        default:true
    },
    profilePhoto:{
        type:String,
        ref:'gallery'
    },
    reviews:[
        {
            customer:{
                type:String,
                ref:'user'
            },
            review:{
                type:String
            }
        }
    ],
    dob:{
        type:Date
    },
    phone:{
        type:String
    },
    serviceDescription:[{
        businessName:{
            type:String
        },
        description:{
            type:String
        },
        coverLetter:{
            type:String
        }
    }],
    category:[
        {
            type:String,
            ref:'category'
        }
    ],
    subCategory:[
        {
            parent:{
                type:String,
                ref:'category'
            },
            category:{
                type:String
            }
        }
    ],
    workPreferences : {
        preferences : {
            toMe:Boolean,
            toCustomer:Boolean
        },
        location:{
            city:String,
            area:String,
            street:String,
            nearestLandMark:String,
            latitude:Number,
            longitude:Number
        },
        travelLimit:{
            limit:Number,
            unit:String
        }
    },
    projects:[
        {
            type:String,
            ref:'project'
        }
    ]
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

var user = mongoose.model('user', UserSchema);

module.exports = { User : user };