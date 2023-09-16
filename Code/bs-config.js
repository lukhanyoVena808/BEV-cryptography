const express = require('express');
const app = express();
const port = 3000;
const ejs = require("ejs");


//static files
app.use(express.static('src'));
app.use('/css', express.static(__dirname +'src/css'))
app.use('/js', express.static(__dirname +'src/js'))
app.use('/img', express.static(__dirname +'src/images'))


//Setting Routes
const registrationRouter = require('./routes/registeration');
const votingRouter = require('./routes/voting');
app.use('/', registrationRouter);
app.use('/', votingRouter);



//set Views
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('', (req, res) => {
    res.render("index");
})

app.get('/vote', (req, res) => {
  res.render("vote");
})

app.get('/register', (req, res) => {
  res.render("register");
})


//listen on port
app.listen(port, ()=> console.info('listening on port ${port}'))


//session
app.use(express.urlencoded());
const session = require('express-session');


// web-portion --------------------------------->
app.use(session({ 
    secret: '@wild**blockchain__init%evote!!#system#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000}
}))


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