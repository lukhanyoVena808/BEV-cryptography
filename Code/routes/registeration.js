
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
var transporter;
// try {
//   const nodemailer = require('nodemailer');
//  transporter = nodemailer.createTransport({
//     service: 'hotmail',
//     auth: {
//       user: 'rishfish808@outlook.com',
//       pass: '158410Xx',
//     },
//   });

  
// } catch (error) {
//   console.log(error)
  
// }

//


router.post('/register', urlencodedParser, async function(req, res, next) { 
  
            const {name, surname, personID, email} = req.body;
            const otpGenerator = require('otp-generator');
            const sharedSecret = 'YOUR_SHARED_SECRET';
            const otp = "helloWord";
    
              const mailOptions = {
                from: 'rishfish808@outlook.com',
                to: 'lookmane001@gmail.com',
                subject: 'E-VoteZ OTP for Authentication',
                text: `Your OTP is: ${otp}`,
              };
              
              // try {
              //   await transporter.sendMail(mailOptions, (error, info) => {
              //     if (error) {
              //       console.error('Error sending OTP via email:', error);
              //       // Handle the error appropriately
              //     } else {
              //       console.log('OTP sent via email:', info.response);
              //       // Continue with the OTP authentication flow
              //     }
              //   });
                
              // } catch (error) {
              //   console.log(error)
              // }
        
            res.render('register2', {encrypted_word1: name, encrypted_word2: surname, encrypted_word3: personID, encrypted_word4:email, encrypted_word5:otp});
            
});

module.exports = router;

