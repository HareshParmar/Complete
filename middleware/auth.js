const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req,res,next) {
    // console.log('Authenticating..');
    // next();
    const token = req.header('x-auth-token');
    if(!token) return res.status(400).send('Access Denied, no token provided');

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}

module.exports = auth;