
const express = require('express');
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


// Render form
router.get('/registerInProgress', function(req, res, next) {
    res.render('register2');

});

// email validation

const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//     service: 'hotmail',
//     auth: {
//       user: 'lukh16@outlook.com',
//       pass: '158410Xx',
//     },
//   });
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',                  // hostname
    service: 'outlook',                             // service name
    secureConnection: false,
    tls: {
        ciphers: 'SSLv3'                            // tls version
    },
    port: 587,                                      // port
    auth: {
        user: "lukh16@outlook.com",
        pass: "158410Xx"
    }
});
const redis = require('redis');
const client = redis.createClient();

//


router.post('/register', urlencodedParser, async function(req, res, next) { 
    // $.getJSON("../../ids.json", function(election) {
    //     var electionInstance;
    //     const myArray = election.data;
    //     console.log(JSON.stringify(myArray))
    // });   
            const {name, surname, personID, email} = req.body;
            // contract("Election", function(accounts) {
            //     var electionInstance;
            // });
          
            const otpGenerator = require('otp-generator');
            const sharedSecret = 'YOUR_SHARED_SECRET';
            const otp = "helloWord";
    
              const mailOptions = {
                from: 'lukh16@outlook.com',
                to: 'lookmane001@gmail.com',
                subject: 'E-VoteZ OTP for Authentication',
                text: `Your OTP is: ${otp}`,
              };
              
              await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error('Error sending OTP via email:', error);
                  // Handle the error appropriately
                } else {
                  console.log('OTP sent via email:', info.response);
                  // Continue with the OTP authentication flow
                }
              });
             
            res.render('register2', {encrypted_word1: name, encrypted_word2: surname, encrypted_word3: personID, encrypted_word4:email, encrypted_word5:otp});
            
});

module.exports = router;

