const speakeasy = require('speakeasy');
const express = require('express');
const cj = require("crypto-js");
const Email = require('email-templates');
const bodyParser = require('body-parser');
const {check, validationResult} = require("express-validator");
const router = express.Router(); 
const cors = require('cors')
const app = express();
app.use(require('sanitize').middleware);
app.use(cors);
app.use(bodyParser.json());
app.use(express.static('src'))
app.set('view engine', 'ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: true});

//GET ststic files
app.use('/css',express.static(__dirname + 'src/css'))

// Render form
router.get('/register', function(req, res, next) {
    res.render('register');

});

router.get('/voteAudit', function(req, res, next) {
  res.render('verify');

});



const nodemailer = require('nodemailer');

//  *************** USE YOUR MAIL-TRAP CREDENTIALS HERE  *************
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525, 
  auth: {
    user: "",  // PUT USE DETAILS HERE
    pass: ""  //PUT YOUR PASSWORD HERE
  }
});
  
router.post('/registration', urlencodedParser, async function(req, res) {  
                
                // let de = cj.AES.decrypt(req.body.data, "winner");
                // let d_data = JSON.parse(de.toString(cj.enc.Utf8));
                // const name = d_data.name;
                // const surname = d_data.surname;
                // const personID = d_data.personID;
                // const email = d_data.email;
                const {name, surname, personID, email} = req.body;
                
                  let  otp;
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
                    
                    
                  } catch (error) {
                    console.log(error) 
                  }
                
                if(name!='' && surname!='' && personID!='' && email!=''){

                      // checks if name is not empty and sents the OTP to the MAIL-TRAP INBOX
                      try { 
                        if(name!=''){
 
                            const mailOptions = {
                              from: 'lxgog@mail.com',
                              to: email,
                              subject: 'E-Votez OTP Code',
                              html: "<p>Hello, <strong>"+name+"</strong></br>Use the OTP Code below to complete your registration:</p>"+"<h1>"+otp+"</h1>"
                            };
                             await transporter.sendMail(mailOptions, (error, info) => {
                              if (error) {
                                  console.log(error);
                                  res.status(500).send('Error sending email');
                              } else {                                           //This appers on your console if email us successful
                                  console.log('Email sent: ' + info.response);
                                  res.send('Email sent successfully');
                              }
                            });   
                         }
                                        
                        } catch (error) {
                          console.log(error)
                        }
                      res.render('register2', {encrypted_word1: name, encrypted_word2: surname, encrypted_word3: personID, encrypted_word4:email, encrypted_word5:otp});
                  }
                  else{
                    res.render('register');
                  }
 
      

     
});

module.exports = router;

