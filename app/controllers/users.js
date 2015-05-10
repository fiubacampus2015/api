
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  jwt   = require('jwt-simple'),
  User = mongoose.model('User'),
  Token = mongoose.model('Token'),
  Message = mongoose.model('Message'),
  Relationship = mongoose.model('Relationship')
  config = require('../../config/config'),
  utils = require('../../lib/utils');

exports.wallGet = function(req, res) {
  User.wall({
    _id : req.params.user 
  },{},'_id content user', function(err, user) {
      res.status(200).json(user.wall);   
  }); 
};

exports.wallPost = function(req, res) {
  User.complete({ 
    _id : req.params.user
  }, '' ,function(err, user){
    var message = new Message(req.body);
    message.user = req.user;
    message.save(function(err){
      user.wall.push(message);
      user.save(function(err){
        if(err) return res.status(400).json(err);
        res.status(201).json(user.wall);
      });  
    });
  });
};

exports.rejectFriend = function(req, res, next) {
   Relationship.getPendingRelationShip(req.params.friendId, req.profile.id, 
    function(err, relationship) {
      relationship.status = 'reject';
      relationship.save(function(err) {
        if(err) return res.status(400).json(err);
        res.status(200).json(relationship);  
    });    
  }); 
}

exports.confirmFriend = function(req, res, next) {
  Relationship.getPendingRelationShip(req.params.friendId, req.profile.id, 
    function(err, relationship) {
      relationship.status = 'ok';
      relationship.save(function(err) {
        if(err) return res.status(400).json(err);
        res.status(200).json(relationship);  
    });    
  });
};

exports.friends = function(req, res, next) {
  var criteria = {};
  Object.keys(req.query).forEach(function(key){
      criteria[key] = new RegExp('^' + req.query[key] + '.*', "i");
  });

  Relationship.getFriends(req.params.user, criteria,
    function(err, friends) {
      if (err) return next(err);
      return res.status(200).json(friends);
  }); 
};

exports.pending = function(req, res, next) {
  var criteria = {};
  Object.keys(req.query).forEach(function(key){
      criteria[key] = new RegExp('^' + req.query[key] + '.*', "i");
  });

  Relationship.getPending(req.params.user, criteria,
    function(err, friends) {
      if (err) return next(err);
      return res.status(200).json(friends);
  }); 
}

exports.search = function(req, res) {

  var criteria = {};

  Object.keys(req.query).forEach(function(key){
      criteria[key] = new RegExp('^' + req.query[key] + '.*', "i");
  });
  Relationship.getFriends(req.user._id, criteria,
    function(err, friends) {
      if (err) return next(err);
      var friends_id = [];
      friends.forEach(function(f) {
        f["friend"] = true;
        friends_id.push(f._id);
      });
      User.find(criteria,"_id name username email personal education")
        .where("_id")
        .nin(friends_id)
        .exec(function(err, users) {
          if(!err) {
            users.forEach(function(u) {
              u["friend"] = false;
              friends.push(u);
            });  
          } else {
            console.log("error", err);
          }
          return res.status(200).send(friends);
      });
  });  
};

exports.addFriend = function(req, res) {
  var user = req.profile;

  var relationship = new Relationship({
    me: req.profile.id,
    other:req.params.friendId,
    status: 'pending', //TODO: cambiar a pending
    type: 'friends'
  }).save(function(err) {
    if(err) return res.status(400).json(err);
    res.status(200).json(user);
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
    if(err) return res.status(400).json(err);
    req.profile = user;
    next()
  });
};

exports.get = function(req, res) {

    res.status(200).json(req.profile);
};

exports.put = function(req, res){
  var user = req.profile,
    userReq = req.body;
  Object.keys(userReq).forEach(function(key){
    user[key] = userReq[key];
  });

  user.save(function(err){
    if(err) return res.status(400).json(err);
    res.status(200).json(user);
  });
};

var map = function(model, json) {
  Object.keys(model).forEach(function(key){
    if( model[key] instanceof Object )
      map(model[key], json)
    model[key] = json[key];
  });
};

exports.authenticate = function(req, res, next){

  User.findOne({ email: req.body.email }, function (err, user) {
      if(!user || !user.authenticate(req.body.password)) {

        return res.status(401).json({
                      errors:["Error durante el login"]
                });
      }
      else {
        Token.findOne({_user: user}, function(err, token){
          if(!err && token) {
            token.value = jwt.encode(user.hashed_password, config.TOKEN_SECRET)
          } else { 
            var token = new Token({
              value:jwt.encode(user.hashed_password, config.TOKEN_SECRET),
              _user: user
            });
          }

          token.save(function(err){
            if(err) return next(err);
              res.status(200).json({
                token: token._id, 
                photo: user.personal.photo, 
                id: user.id, 
                name: user.name, 
                surname: user.username, 
                confirmed: user.confirmed});
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