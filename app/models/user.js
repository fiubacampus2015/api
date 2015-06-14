var mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  crypto = require('crypto');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  status: { type: String, default: '' },
  suspend: { type: Boolean, default: false },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  confirmation: { type: String, default: '' },
  confirmed:{ type: Boolean, default: false },
  personal: {
    photo: { type: String, default:'' },
    comments: { type: String, default:'' },
    phones: {
      mobile: { type: String, default:'' },
      other: { type: String, default:'' }
    },
    birthday: Date,
    gender: { type: String, default:''},
    nacionality: { type: String, default:'' },
    city: { type: String, default:'' }  
  },
  job:{
    companies:[{
      initdate: Date,
      enddate: Date,
      place: { type: String, default:'' }  
    }]
  },
  education: {
    creditos: { type: String, default:'' },
    careers:[{
      title: { type: String, default:'' },
      branch: { type: String, default:'' },
      initdate: Date
    }]
  },
  friend: { type: Boolean, default:false },
  wall: [{ type: Schema.Types.ObjectId, ref:'Message' }],
  lastPosition:{type:String, default:''}, 
  created_at: { type: Date }, 
  updated_at: { type: Date } 
});

var oAuthTypes = [
  'github',
  'twitter',
  'facebook',
  'google',
  'linkedin'
];


UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password });


var validatePresenceOf = function (value) {
  return value && value.length;
};

UserSchema.path('name').validate(function (name) {
  if (this.skipValidation()) return true;
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  if (this.skipValidation()) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');
  //if (this.skipValidation()) fn(true);

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email, confirmed: true }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Email already exists');

UserSchema.path('username').validate(function (username) {
  if (this.skipValidation()) return true;
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (this.skipValidation()) return true;
  return hashed_password.length;
}, 'Password cannot be blank');


UserSchema.pre('save', function(next) {
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }

  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.skipValidation()) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
})

UserSchema.methods = {

  authenticate: function (plainText) {
    return /*this.confirmed && */this.encryptPassword(plainText) === this.hashed_password;
  },

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  skipValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  }
};

UserSchema.statics = {

  
  load: function (options, cb) {
    //options.select = options.select || 'name username email confirmation personal';
    this.findOne(options)
      //.select(options.select)
      .exec(cb);
  },
  friends: function(options, friendsOptions, select ,cb) {
    //friendsOptions.select = friendsOptions.select || '_id name email personal';
    this.findOne(options).populate({
      path: 'contacts.user',
      match: friendsOptions,
      select: select || '_id name email personal',
      options: { sort: 'name' }
    })
    .exec(cb);
  },
  wall: function(user_id, wallOptions, select, cb) {
    Message.find({
      me: user_id
      }).populate({
        path:'me user',
        select: '_id name username'

      }).sort([['date', 'descending']]).exec(cb);


    /*this.findOne({ _id: user_id}).populate({
      path: 'wall',
      select: select || '_id content user',
      options: { sort: 'date' }
    })
    .exec(cb);*/
  },
  complete: function(options, select, cb) {
    this.findOne(options).populate({
      path: 'contacts',
      select: select || '_id name email personal'
    })
    .populate({
      path: 'wall',
      select: '_id content user'
    })
    .exec(cb);
  }
}

mongoose.model('User', UserSchema);
