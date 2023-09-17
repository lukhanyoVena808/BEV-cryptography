
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
router.get('/adminOverView', function(req, res, next) {
  res.render('adminOverView');
});

// Retrieve User input
router.post('/adminOverView', urlencodedParser, function(req, res, next) {      
            res.render('adminOverView');
            
});

module.exports = router;

