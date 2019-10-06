const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/userModel');
const _ = require('lodash');
const bcryptjs = require('bcryptjs');
const auth = require('../middleware/auth');

router.get('/', async (request, response) => {
    try {
        const users = await User.find();
        response.send(users);
    }
    catch (err) {
        response.status(500).send('something went wrong!');
    }
});

router.get('/me',auth, async (request, response) => {
    try {
        const users = await User.findById(request.user._id).select('-password -__v');
        response.send(users);
    }
    catch (err) {
        response.status(500).send('something went wrong!');
    }
});

router.post('/', async (request, response) => {
    try {
        const { error } = validate(request.body);
        if (error) return response.status(400).send(error.details[0].message);

        let checkUser = await User.findOne({ email : request.body.email });
        if(checkUser) return response.status(400).send('User already registered');
        // this approach is traditional we have one more approach 
        
        // const user = new User({
        //     name: request.body.name,
        //     email: request.body.email,
        //     password: request.body.password
        // });
        // _.pick will take source(array) and then extract the information from it by giving the name or key of array(JSON)
        let user = new User(_.pick(request.body,['name','email','password']));
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password,salt);;
        await user.save();
        // response.send('Created');
        const token = checkUser.generateAuthToken();
        response.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));
    }
    catch (err) {
        response.status(500).send('something went wrong!');
    }
});

router.put('/:id', async (request, response) => {
    try {
        const { error } = validate(request.body);
        if (error) return response.status(400).send(error.details[0].message);

        const user = await User.findByIdAndUpdate(request.params.id, {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password
        }, { new: true });

        if (!user) return res.status(404).send('The user with the given ID was not found.');

        response.send(user);
    }
    catch (err) {
        response.status(500).send('something went wrong!');
    }
});

router.delete('/:id', async (request, response) => {
    try {
        const user = await User.findByIdAndRemove(request.params.id);
        if (!user) return res.status(404).send('The user with the given ID was not found.');
        response.send(user);
    }
    catch (err) {
        response.status(500).send('something went wrong!');
    }
});

module.exports = router;