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
// const email200 = new Email({
//   message: {
//     from: 'lxgog@mail.com'
//   },
//   // uncomment below to send emails in development/test env:
//   // send: true
//   transport: {
//     jsonTransport: true
//   }
// });

const Mailgen = require('mailgen');

const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0a870ddc03757e",
    pass: "0f32dfe8d840ca"
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
          
              // email200.send({
              //     template: './mars',
              //     message: {
              //       to: email
              //     },
              //     locals: {
              //       name: name,
              //       _otp: otp
              //     }
              //   })
                // .then(console.log)
                // .catch(console.error)
                // verify connection configuration
                const mailGenerator = new Mailgen({
                  theme: 'default',
                  product: {
                      // Appears in header & footer of e-mails
                      name: 'Mailgen',
                      link: 'https://mailgen.js/'
                      // Optional product logo
                      // logo: 'https://mailgen.js/img/logo.png'
                  }
                });
                const email300 = {
                  body : {
                      name: name,
                      intro : 'Welcome to Test Mail! We\'re very excited to have you on board: ',
                      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
                  }
              }
              try {
                // Generate an HTML email with the provided contents
                // var emailBody = mailGenerator.generate(email300);y
                const mailOptions = {
                  from: 'lxgog@mail.com',
                  to: email,
                  subject: 'E-Votez OTP Code',
                  html: "<h1>"+otp+"</h1>"
              };
              await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error sending email');
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send('Email sent successfully');
                }
             });
                                
              } catch (error) {
                console.log(error)
              }

        
            res.render('register2', {encrypted_word1: name, encrypted_word2: surname, encrypted_word3: personID, encrypted_word4:email, encrypted_word5:otp});
            
});

module.exports = router;

