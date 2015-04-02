
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  jwt   = require('jwt-simple'),
  User = mongoose.model('User'),
  Token = mongoose.model('Token'),
  config = require('../../config/config'),
  utils = require('../../lib/utils');

exports.post = function(req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function(err){
    if(err) return res.status(200).json(err);
    res.status(201).json(user);
  });
};

exports.get = function(req, res){
  res.status(200).json(req.profile);  
};

exports.authenticate = function(req, res, next){
  User.findOne({ username: req.body.username }, function (err, user) {
      if(!user || !user.authenticate(req.body.password)) {
        return res.status(401).json({
                      errors:["Error durante el login"]
                });
      }
      else {
        var token = new Token({
          value:jwt.encode(user, config.TOKEN_SECRET),
          _user: user
        });

        token.save(function(err){
          if(err) return next(err);
          res.status(200).json({token: token._id, id: user.id, photo: user.photo});
        });
      }
  });
};

exports.load = function (req, res, next, id) {
  var options = {
    criteria: { _id : id }
  };
  User.load(options, function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};