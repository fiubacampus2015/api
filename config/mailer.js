var mailer   = require("mailer"),
config = require("./config");

exports.send = function() {
  mailer.send(
    { host:           "smtp.mandrillapp.com"
    , port:           587
    , to:             "alexispetalas@gmail.com"
    , from:           "noreply@campus.com"
    , subject:        "campus 2015"
    , body:           "Hola soy el campuss buuu"
    , authentication: "login"
    , username:       config.MANDRILL_USERNAME
    , password:       config.MANDRILL_APIKEY
    }, function(err, result){
      if(err){
        console.log(err);
      }
    }
  );
};

