
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  jwt   = require('jwt-simple'),
  User = mongoose.model('User'),
  Token = mongoose.model('Token'),
  config = require('../../config/config'),
  utils = require('../../lib/utils');

exports.search = function(req, res) {
  var criteria = {};
  
  Object.keys(req.query).forEach(function(key){
    criteria[key] = new RegExp('.*' + req.query[key] + '.*', "i")
  });

  User.findOne(criteria, function(err, users) {
      return res.status(200).send(users);
  });
};

exports.showConfirm = function(req, res, next){
  var user = req.profile;
  user.confirmed = true;
  user.save(function(err){
    if(err) return next(err);
    res.render('confirm', { status:req.confirm.status });
  });  
}

exports.post = function(req, res, next) {
  var user = new User(req.body);
  user.confirmation = jwt.encode(user.email, config.TOKEN_SECRET);
  user.provider = 'local';
  user.save(function(err){
    if(err) return res.status(200).json(err);
    req.profile = user;
    next()
  });
};

exports.get = function(req, res) {

    res.status(200).json(req.profile);
};

exports.putPersonal = function(req, res){
  var user = req.profile,
    personal = req.body.personal

  Object.keys(personal).forEach(function(key){
    user.personal[key] = personal[key];  
  });
  user.save(function(err){
    if(err) return res.status(400).json(err);
    res.status(200).json(user);
  });
};

exports.authenticate = function(req, res, next){

  User.findOne({ username: req.body.username }, function (err, user) {
      if(!user || !user.authenticate(req.body.password)) {
        return res.status(401).json({
                      errors:["Error durante el login"]
                });
      }
      else {
        Token.findOne({_user: user}, function(err, token){
          if(!err && token) {
            token.value = jwt.encode(user, config.TOKEN_SECRET)
          } else { 
            var token = new Token({
              value:jwt.encode(user, config.TOKEN_SECRET),
              _user: user
            });
          }

          token.save(function(err){
            if(err) return next(err);
            res.status(200).json({token: token._id, id: user.id, photo: user.photo});
          });
        })
      }
  });
};

// For params :userId
exports.load = function (req, res, next, id) {
  User.load({ _id : id }, function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};