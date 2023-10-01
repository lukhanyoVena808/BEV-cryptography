const express = require('express');
const terminatorHTTP =  require('http-terminator');

const app = express();
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
//exress.json, sends data in json format
//middleware that paases url with payloads.
//username=user&password=password
//extedned = true, objects and arrays to be encoded.
//originally post method data can be accessed by 
// req.body.passwprd, -> using name identifier
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

app.get('', (req, res) => {
    res.render("index");
})

//listen on port
const server = app.listen(port, ()=> console.info('listening on port ${port}'));

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