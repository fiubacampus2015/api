var mailer   = require("mailer"),
config = require("./config");

exports.sendConfirmation = function(to, link, callback) {

  mailer.send(
  { host:           "smtp.mandrillapp.com"
  , port:           25
  , to:             "alexispetalas@gmail.com"
  , from:           "you@yourdomain.com"
  , subject:        "Mandrill knows Javascript!"
  , body:           link
  , authentication: "login"
  , username:       "app35427088@heroku.com"
  , password:       "qwbuII_mpMyq_pKV8AtEgw"
  }, callback);
/*
  mailer.send(
    { host:           "smtp.mandrillapp.com"
    , port:           587
    , to:             "alexispetealas@gmail.com"
    , from:           "noreply@campus.com"
    , subject:        "campus 2015"
    , body:           "Bienvenido al campus fiuba 2015, para finalizar confirma tu registro: "
    , authentication: "login" 
    , username:       "app35427088@heroku.com"
    , password:       "qwbuII_mpMyq_pKV8AtEgw"
    }, function(err, result){
      res.status(201).json();
      console.log("mailer:", err, result)
      if(err){
        console.log(err);
      }
    }
  );
*/
};

