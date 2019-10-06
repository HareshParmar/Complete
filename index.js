const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const home = require('./home');
const logger = require('./middleware/logger');
const mongoose = require('mongoose');
// there was a deprecate warning to over come used createIndex 
mongoose.set('useCreateIndex', true);
mongoose.set('useFindOneAndUpdate', true);
const customer = require('./routes/customer');
const movie = require('./routes/movies');
const rental = require('./routes/rental');
const user = require('./routes/user');
const auth = require('./routes/auth');
const config = require('config');
const error = require('./middleware/error');

// process.on('uncaughtException',(err)=>{
//     winston.error(err.message,err);
//     process.exit(1);
// });

winston.handleExceptions(
    new winston.transports.File({
        filename: 'uncaughtException.log'
    })
);

process.on('unhandledRejection',(ex)=>{
    // winston.error(ex.message,ex);
    // process.exit(1);
    throw ex;
});

winston.add(winston.transports.File, { filename: 'logfile.log' });

winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/Learning',
    useNewUrlParser: true,
    level: 'error'
});

// throw new Error('Failed');

mongoose.connect('mongodb://localhost/Learning', { useNewUrlParser: true })
    .then(() => console.log('Connected'))
    .catch((err) => console.log(err.message));

if (!config.get('jwtPrivateKey')) {
    // go to cmd and set the value of the key :-> valueofKey=newValue
    console.error('Fatal error : jwtkey not defined');
    process.exit(1);
}

app.use(express.json());
app.use(logger);
// *********************************** ROUTES ****************************** //
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customer', customer);
app.use('/api/movie', movie);
app.use('/api/rental', rental);
app.use('/api/users', user);
app.use('/api/login', auth);
app.use(error);
// *********************************** ROUTES ****************************** //

app.set('view engine', 'pug');
app.set('views', './views');


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));