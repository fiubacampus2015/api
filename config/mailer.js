var mailer   = require("mailer"),
config = require("./config");
var fs = require('fs');

var mailTemplate = fs.readFileSync('./app/views/confirm_mail.html').toString();

exports.sendConfirmation = function(to, link, callback) {

  var currentTemplate = mailTemplate.replace('$link',link);

  mailer.send(
  { host:           "smtp.mandrillapp.com"
  , port:           25
  , to:             to
  , from:           "noreply@campus.fi.uba.com.ar"
  , subject:        "campus 2015, finalizar registro"
  , body:           currentTemplate
  , authentication: "login"
  , username:       "app35427088@heroku.com"
  , password:       "qwbuII_mpMyq_pKV8AtEgw"
  }, callback);
};

