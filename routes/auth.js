const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { User } = require('../models/userModel');
const bcryptjs = require('bcryptjs');

router.post('/', async (request, response) => {
    try {
        const { error } = validate(request.body);
        if (error) return response.status(400).send(error.details[0].message);

        const checkUser = await User.findOne({ email : request.body.email });
        if(!checkUser) return response.status(400).send('Email does not exist');

        const checkpass = await bcryptjs.compare(request.body.password, checkUser.password);
        if(!checkpass) return response.status(400).send('Password is invalid');
       
        const token = checkUser.generateAuthToken();
        response.header('x-auth-token',token).send(token);
    }
    catch (err) {
        response.status(500).send('something went wrong!');
    }
});

function validate(req) {
    const schema = {
        email: Joi.string().min(8).max(50).required().email(),
        password: Joi.string().min(6).max(30).required()
    };
    return Joi.validate(req,schema);
}

module.exports = router;