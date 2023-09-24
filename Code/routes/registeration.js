const speakeasy = require('speakeasy');
const express = require('express');
const Email = require('email-templates');
const bodyParser = require('body-parser');
const {check, validationResult} = require("express-validator");
const router = express.Router();
const app = express();
app.use(express.static('src'))
app.set('view engine', 'ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: false});


//GET ststic files
app.use('/css',express.static(__dirname + 'src/css'))

// Render form
router.get('/register', function(req, res, next) {
    res.render('register');

});




// email validation
const email200 = new Email({
  message: {
    from: 'lxgog@mail.com'
  },
  // uncomment below to send emails in development/test env:
  // send: true
  transport: {
    jsonTransport: true
  }
});
//



router.post('/registration', urlencodedParser, async function(req, res, next) { 
              const {name, surname, personID, email} = req.body;
              var otp;
              try {
                
                // Generate a secret key with a length
                // of 20 characters
                const secret = speakeasy.generateSecret({ length: 20 });
                  
                // Generate a TOTP code using the secret key
                otp = speakeasy.totp({
                  
                    // Use the Base32 encoding of the secret key
                    secret: secret.base32,
                  
                    // Tell Speakeasy to use the Base32 
                    // encoding format for the secret key
                    encoding: 'base32'
                });
                  
                // Log the secret key and TOTP code
                // to the console
                // console.log('Secret: ', secret.base32);
                // console.log('Code: ', otp);
                
              } catch (error) {
                console.log(error)
              }
              console.log(otp);
          
              email200.send({
                  template: './mars',
                  message: {
                    to: email
                  },
                  locals: {
                    name: name,
                    _otp: otp
                  }
                })
                // .then(console.log)
                .catch(console.error)
                        
            res.render('register2', {encrypted_word1: name, encrypted_word2: surname, encrypted_word3: personID, encrypted_word4:email, encrypted_word5:otp});
            
});

module.exports = router;

