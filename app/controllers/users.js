
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');

exports.post = function(req, res) {
  var user = new User(req.body.user);
  user.save(function(err){
    if(err) return res.status(200).json(err);
    res.status(201).json(user);
  });
};

exports.get = function(req, res){
  res.status(200).json(req.profile);  
};

exports.authenticate = function(req, res, next){
  
  User.findOne({ email: req.body.username, password: req.body.password }, function (err, user) {
      if(!user || !user.authenticate(req.body.password)) {
        return res.json(401, {error: "Error durante el login"});
      }
      else {
        var token = new Token({
          value:jwt.encode(user, config.token.secret),
          _user: user
        });

        token.save(function(err){
          if(err) return next(err);
          res.json(201, {token: token._id, id: user.id, photo: user.photo});
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