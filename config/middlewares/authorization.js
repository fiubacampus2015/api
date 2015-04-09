var mongoose  = require('mongoose'),
mailer = require('../mailer'),
Token = mongoose.model('Token');

exports.requiresLogin = function(req, res, next) {
  Token
  .findById(req.params.token)
  .populate('_user')
  .exec(function (err, token) {
    if(err)
      return res.status(401).json(err);
      req.user = token._user;
      next();
  });
};

exports.sendConfirmation = function(req, res){
  mailer.sendConfirmation(req.profile.email, 
    "http://" 
    + req.headers.host 
    + "/api/users/"
    + req.profile._id
    + "/confirm/" 
    + req.profile.confirmation
    , function(err, result) {
      if(err)
        return res.status(200).json(err);

      res.status(201).json({
        user:req.profile,
        confirmation: req.profile.confirmation
      });
    });
}

exports.confirm = function(req, res, next) {
  req.confirm = {};
  if(req.profile.confirmation === req.params.confirmation) {
    req.confirm.status = "confirmed";
    return next();
  }

  next(new Error('Error confirmation'));
}
/*


 *  Generic require login routing middleware
 */

exports.web_requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/login')
};

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/' + req.profile.id)
    }
    next()
  }
};

/*
 *  Article authorization routing middleware
 */

exports.article = {
  hasAuthorization: function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/articles/' + req.article.id)
    }
    next()
  }
}

/**
 * Comment authorization routing middleware
 */

exports.comment = {
  hasAuthorization: function (req, res, next) {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
      next()
    } else {
      req.flash('info', 'You are not authorized')
      res.redirect('/articles/' + req.article.id)
    }
  }
}
