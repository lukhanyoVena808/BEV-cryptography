const express = require('express');
const app = express();
const port = 3000;
const ejs = require("ejs");

//static files
app.use(express.static('src'));
app.use('/css', express.static(__dirname +'src/css'))
app.use('/js', express.static(__dirname +'src/js'))
app.use('/img', express.static(__dirname +'src/images'))


app.get('', (req, res) => {
    res.sendFile( __dirname  + "src/index.html" );
})


//listen on port
app.listen(port, ()=> console.info('listening on port ${port}'))






// app.use(express.urlencoded());
// var session = require('express-session');
// var bodyParser = require('body-parser'); 
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

// fetching table
// var path = require('path');
// app.set('views', path.join(__dirname, '/src/views'));
// app.set('view engine', 'ejs');





// web-portion --------------------------------->
// app.use(session({ 
//     secret: '123456cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000*300 }
// }))


// var registrationRouter = require('./routes/registration-route');
// var loginRouter = require('./routes/login-route');
// var dashboardRouter = require('./routes/dashboard-route');
// var logoutRouter = require('./routes/logout-route');
// var RegisterRouter = require('./routes/main');
// var AdminLogin = require('./routes/admin_login');
// var Tableview =  require('./routes/table_view');

// app.use('/', registrationRouter);
// app.use('/', loginRouter);
// app.use('/', dashboardRouter);
// app.use('/', logoutRouter);
// app.use('/',RegisterRouter);
// app.use('/',FirstPage);
// app.use('/',AdminLogin);
// app.use('/',Tableview);
// web-portion --------------------------------->


// app.get('/registration', function (req, res) {
//    res.sendFile( __dirname  + "/src/register.html" );
// })

// app.get('/voting', function (req, res) {
//   res.sendFile( __dirname  + "/src/vote.html" );
// })

// app.get('/userInfo', function (req, res) {
//   res.sendFile( __dirname  + "/src/userInfo.html" );
// })

// app.get('/result', function (req, res) {
//   res.sendFile( __dirname  + "/src/result.html" );
// })

// app.get('/addCandidate', function (req, res) {
//   res.sendFile( __dirname  + "/src/adminAddCandidate.html" );
// })

// app.get('/changePhase', function (req, res) {
//   res.sendFile( __dirname  + "/src/adminChangePhase.html" );
// })

// app.get('/voting', function (req, res) {
//   res.sendFile( __dirname  + "/src/voting.html" );
// })


// app.get('/admin', function (req, res) {
//    res.send('hello');
// })

module.exports = {
  "server": {
    "baseDir": ["./src", "./build/contracts"],
    "routes": {
      "/node_modules": "node_modules"
    },
    middleware: {
      1: app,
  },
},
port:port,
};