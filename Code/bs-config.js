const express = require('express');
const terminatorHTTP =  require('http-terminator');
const fs = require('fs');
const http2 = require('https');
const http2Express = require('http2-express-bridge')
const spdy = require('spdy');


const app = http2Express(express);
app.use(require('sanitize').middleware);
const port = 3000;



//static files
app.use(express.static('src'));
app.use('/css', express.static(__dirname +'src/css'))
app.use('/js', express.static(__dirname +'src/js'))
app.use('/img', express.static(__dirname +'src/images'))


//Setting Routes
const registrationRouter = require('./routes/registeration');
const votingRouter = require('./routes/voting');
const adminLogin = require('./routes/adminLog');
const adminCandidate= require('./routes/adminCands');
const adminGetResults = require('./routes/adminView');
const getUser = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', registrationRouter);
app.use('/', votingRouter);
app.use('/', getUser)

app.use('/', adminLogin);
app.use('/', adminCandidate);
app.use('/', adminGetResults)



//set Views
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('',async (req, res) => {
    
      res.render("index");
})

//// create the http2 server
const options = {
  key: fs.readFileSync('exc/localhost.decrypted.key'),
  cert: fs.readFileSync('exc/localhost.crt'),
  allowHTTP1: true
};


const server = http2.createServer(options, app);

//listen on port
server.listen(port, ()=> console.info(`listening on port ${port}`));

const httpTerminator = terminatorHTTP.createHttpTerminator({
  server,
});


httpTerminator.terminate();

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