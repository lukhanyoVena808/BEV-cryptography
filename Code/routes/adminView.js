
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
router.get('/results', function(req, res, next) {
  res.render('adminResults');
});

// Retrieve User input
router.post('/results', urlencodedParser, function(req, res, next) {      
            res.render('adminResults');
            
});

module.exports = router;

