
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

// Retrieve User input
router.post('/register', urlencodedParser, function(req, res, next) {     
            const fname=req.body.name;
            const surname= req.body.surname;
            const email_address= req.body.email;
            const personID= req.body.personID;
            const msg ="You are successfully registered!";    
            res.render('register',{
            alertMsg:msg});
            
});

module.exports = router;
