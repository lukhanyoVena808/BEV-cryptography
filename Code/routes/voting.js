
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
router.get('/vote', function(req, res, next) {
  // res.render('vote');
  setTimeout(function() {
    res.render('vote');
}, 500); 
});

// Retrieve User input
router.post('/vote', urlencodedParser, function(req, res, next) {    
            setTimeout(function() {
              res.render('\\');
          }, 500);  
});

module.exports = router;

