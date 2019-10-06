const helmet = require('helmet');
const _ = require('lodash');
const logger = require('./logger');
const authenticate = require('./authenticating');
const express = require('express');
const app = express();
const morgan = require('morgan');
const Config = require('config');
const appDebug = require('debug')('app:Startup');
const appDebugDB = require('debug')('app:DB');

app.use(express.json());
// express.json() is the middle ware

app.use(express.urlencoded({ extended: true })); // key&value pair in header

// to serve static files there is one built in middle ware
app.use(express.static('public'));

// resolving done by require.
// Core module
// file or folder
// node_modules

// to store passwords of mail or any other use Enviroment variables
// and to make sure the name of that variable is unique, use projectname as prefix

console.log('Name is '+ Config.get('name'));
// console.log('Name is '+ Config.get('mail.Email'));
// console.log('Password is '+ Config.get('mail.password'));
console.log(`${process.env.practice_password}`);

// helmet is a 3rd party middleware
// it is used to set html headers // Helps secure your apps by setting various HTTP headers.

app.use(helmet());

// here we will use the templating engine.. by default we dont need it but its for sake of example.
//

app.set('view engine','pug');
app.set('views','./views');
//

app.use(logger);
// these are the middleware functions and they execute in sequence
app.use(authenticate);


// to get the enviroment
console.log(`Enviroment of node_env is:${process.env.NODE_ENV}`);
console.log(`get Enviroment of node_env using app is:${app.get('env')}`);
if (app.get('env') === 'development') {
    // morgan is a html logger
    app.use(morgan('tiny'));
    console.log('Morgan Enabled...');
    appDebug('Morgan Enabled');
    appDebugDB('Harry is here');
    // we used the debug package to log the debugging details....
}
// for changing configuration in different enviroment we use a popular package
// rc  google for npm rc

// but we will use npm package 'config'

var name = ['harry', 'lucy', 'laura', 'ahen', 'nick'];

var getres = _.includes(name, 'harry');
// console.log(getres);

// console.log(_.sortBy(name));

app.get('/api/names', (req, res) => {
   // res.send(name);
    res.render('index',{title:'HEy baby',message:'My Love'});
});

app.post('/api/name', (req, res) => {
    res.send(req.body);
    console.log(req.body);

});

const port = process.env.PORT || 3000;

app.listen(port, () => `Listening on port ${port}`);

