var mailer   = require("mailer"),
config = require("./config");

exports.sendConfirmation = function(to, link, callback) {

  mailer.send(
  { host:           "smtp.mandrillapp.com"
  , port:           25
  , to:             to
  , from:           "noreply@campus.fi.uba.com.ar"
  , subject:        "campus 2015, finalizar registro"
  , body:           "Bienvenido al campus fiuba 2015, para finalizar confirma tu registro: " + link
  , authentication: "login"
  , username:       "app35427088@heroku.com"
  , password:       "qwbuII_mpMyq_pKV8AtEgw"
  }, callback);
};

